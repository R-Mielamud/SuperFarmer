import jwt
from SuperFarmer import settings

def encode_user_token(user):
    return jwt.encode(
        {settings.JWT_USER_FIELD: user.id},
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )

def extract_user_id(token):
    data = jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    return data[settings.JWT_USER_FIELD]

def remove_jwt_prefix(token):
    if not token or not token.startswith(settings.JWT_PREFIX):
        return None

    return token[len(settings.JWT_PREFIX):]

def extract_socket_user(auth):
    from authorization.models import User

    token = remove_jwt_prefix(auth)

    if not token:
        return None

    try:
        user_id = extract_user_id(token)
    except jwt.DecodeError:
        return None

    user = User.objects.filter(id=user_id).first()
    return user
