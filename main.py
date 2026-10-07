
from fastapi import responses
from sqlalchemy import values
from jwt import PyJWTError
from fastapi.security import OAuth2PasswordRequestForm
from schemas import NoteCreate, NoteResponse, UserCreate
from models import User
from fastapi import FastAPI, HTTPException, Depends, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from database import Base, engine, SessionLocal
import models
import jwt
from datetime import datetime, timedelta, timezone

from fastapi import status
Base.metadata.create_all(bind=engine)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True, #Cookie kullanmıyoz aslında gereksiz bu

)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


SECRET_KEY="your_secret_key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE=30




@app.post("/token")
def login_for_access_token(
    response: Response,
    form_data: OAuth2PasswordRequestForm= Depends(),
    db: Session = Depends(get_db)
):
    user=authenticate_user(form_data.username,form_data.password, db)
    if not user:
        raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Yanlış kullanıcı adı veya şifre",
        headers={"WWW-Authenticate": "Bearer"})
    access_token_expire = timedelta(minutes=ACCESS_TOKEN_EXPIRE)
    access_token=create_access_token(
        data={"sub":user.username},
        expires_delta=access_token_expire
    )
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        samesite="lax",
        secure=False, 
        max_age=ACCESS_TOKEN_EXPIRE * 60,
    )
    return {"message":"Giriş Başarılı"}


def get_user_by_username(db:Session, username:str):
    return db.query(User).filter(User.username==username).first()

def create_user(db:Session,user:UserCreate):
    hashed_password = pwd_context.hash(user.password)
    db_user= User(username=user.username,password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    return "complete"


@app.post("/register")
def register_user(user:UserCreate, db:Session=Depends(get_db)):
    db_user=get_user_by_username(db,username=user.username)
    if db_user:
        raise HTTPException(status_code=400,detail=" User already exist")
    return create_user(db=db,user=user)



#authenticate
def authenticate_user(username:str,password:str,db :Session):
    user=db.query(User).filter(User.username==username).first()
    if not user:
        return False
    if not pwd_context.verify(password,user.password_hash):
        return False
    return user

#access token üretmek
def create_access_token(data:dict,expires_delta:timedelta):

    to_encode=data.copy()
    if expires_delta:
        expire=datetime.now(timezone.utc)+expires_delta
    else:
        expire=datetime.now(timezone.utc)+timedelta(minutes=15)
    to_encode.update({"exp":expire})
    encoded_jwt= jwt.encode(to_encode, SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(request: Request):
    token = request.cookies.get("access_token")
    if token is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Giriş yapılmamış")
    try:
        payload= jwt.decode(token,SECRET_KEY, algorithms=[ALGORITHM])
        username:str=payload.get("sub")
        if username is None:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token doğrulanırken hata oluştu")
        return payload
    except PyJWTError:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Token hala geçersiz")


@app.get("/verify-token")
def verify_user_token(payload: dict = Depends(verify_token)):
    return {"message": "token geçerli"}


@app.post("/logout")
def logout(response: Response):
    response.delete_cookie(key="access_token", httponly=True, samesite="lax")
    return {"message": "çıkış yapıldı"}

@app.get('/notes', response_model=list[NoteResponse])
def get_notes(db: Session = Depends(get_db),payload: dict =Depends(verify_token)):
    return db.query(models.Note).all()



@app.post('/notes', response_model=NoteResponse)
def create_note(note: NoteCreate, db: Session = Depends(get_db),payload: dict =Depends(verify_token)):
    new_note = models.Note(title=note.title, content=note.content)
    db.add(new_note)
    db.commit()
    db.refresh(new_note)
    return new_note


@app.put('/notes/{note_id}', response_model=NoteResponse)
def update_note(note_id: int, note: NoteCreate, db: Session = Depends(get_db),payload: dict =Depends(verify_token)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Not bulunamadı")

    db_note.title = note.title
    db_note.content = note.content
    db.commit()
    db.refresh(db_note)
    return db_note


@app.delete('/notes/{note_id}')
def delete_note(note_id: int, db: Session = Depends(get_db),payload: dict =Depends(verify_token)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if db_note is None:
        raise HTTPException(status_code=404, detail="Not database'de yok")

    db.delete(db_note)
    db.commit()
    

    return {"message" : "Atılan notu sildirdik"}


