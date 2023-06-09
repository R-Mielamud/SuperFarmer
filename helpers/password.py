import bcrypt

def hash_password(password):
    salt = bcrypt.gensalt(12)
    return bcrypt.hashpw(password.encode(), salt).decode()

def verify_password(password, etalon):
    return bcrypt.checkpw(password.encode(), etalon.encode())