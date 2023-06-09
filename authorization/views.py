from django.http import JsonResponse
from django.views import View
from helpers.jwt import encode_user_token, extract_socket_user
from helpers.password import verify_password
from .models import User

class RegisterAPI(View):
    def post(self, request):
        data = request.POST
        email_check = User.objects.filter(email=data.get("email")).first()
        username_check = User.objects.filter(username=data.get("username")).first()

        if email_check:
            return JsonResponse({"message": "This email is already taken"}, status=401)

        if username_check:
            return JsonResponse({"message": "This username is already taken"}, status=401)

        create_data = {
            "first_name": data.get("first_name"),
            "last_name": data.get("last_name"),
            "email": data.get("email"),
            "username": data.get("username"),
            "password": data.get("password"),
        }

        user = User.objects.create(**create_data)
        json_user = User.serialize(user)
        token = encode_user_token(user)

        return JsonResponse({
            "user": json_user,
            "jwt_token": token,
        })

class LoginAPI(View):
    def post(self, request):
        data = request.POST
        email = data.get("email")
        password = data.get("password")
        user = User.objects.filter(email=email).first()

        if not user:
            return JsonResponse({ "message": "Email or password is invalid" }, status=401)

        password_valid = verify_password(password, user.password)

        if not password_valid:
            return JsonResponse({ "message": "Email or password is invalid" }, status=401)

        json_user = User.serialize(user)
        token = encode_user_token(user)

        return JsonResponse({
            "user": json_user,
            "jwt_token": token,
        })

class ProfileAPI(View):
    def get(self, request):
        token = request.headers.get("Authorization")
        user = extract_socket_user(token)

        if not user:
            return JsonResponse({ "message": "Not authorized" }, status=401)

        return JsonResponse(User.serialize(user))