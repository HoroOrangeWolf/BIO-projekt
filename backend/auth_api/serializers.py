from django.contrib.auth.models import Group, Permission
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ('id', 'name', 'codename')


class GroupSerializer(serializers.ModelSerializer):
    permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ('id', 'name', 'permissions')


class UserSerializer(serializers.ModelSerializer):
    groups = GroupSerializer(many=True, read_only=True)
    user_permissions = PermissionSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'groups', 'user_permissions')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'pesel', 'first_name', 'last_name')

    email_regex_validator = RegexValidator(
        regex=r'^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$',
        message="Invalid email format"
    )

    def validate_username(self, value):
        if not value:
            raise serializers.ValidationError("Username is required")
        return value

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email is required")
        self.email_regex_validator(value)
        return value

    def validate_password(self, value):
        if len(value) < 6:
            raise serializers.ValidationError("Password must be at least 6 characters")
        try:
            validate_password(value)
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
        return value

    def validate_firstName(self, value):
        if not value:
            raise serializers.ValidationError("First name is required")
        return value

    def validate_lastName(self, value):
        if not value:
            raise serializers.ValidationError("Last name is required")
        return value

    def validate_pesel(self, value):
        if len(value) != 11:
            raise serializers.ValidationError("PESEL must be exactly 11 digits")

        try:
            int(value)
        except ValueError:
            raise serializers.ValidationError("PESEL must contain only digits")

        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            pesel=validated_data['pesel']
        )

        return user
