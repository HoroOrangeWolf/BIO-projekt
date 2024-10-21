from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import Permission, Group
from django.db import transaction
from rest_framework import serializers

from auth_api.models import AuthUser


class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_full_name(self, obj):
        first_name = obj.first_name if obj.first_name else ""
        last_name = obj.last_name if obj.last_name else ""
        full_name = f"{first_name} {last_name}"
        return full_name if first_name != " " else obj.username

    class Meta:
        model = AuthUser
        fields = ["id",
                  "username",
                  "first_name",
                  "last_name",
                  "email",
                  "full_name",
                  "password",
                  "user_permissions",
                  "groups",
                  "is_active",
                  ]

    @transaction.atomic
    def create(self, validated_data):
        # custom_validate_password(validated_data["password"])
        # validated_data.popitem()
        user = super(UserSerializer, self).create(validated_data)
        user.set_password(validated_data["password"])
        user.save()
        return user

    @transaction.atomic()
    def update(self, instance, validated_data):
        if "password" in validated_data:
            raw_password = validated_data.pop("password")
            # custom_validate_password(raw_password)
            validated_data["password"] = make_password(raw_password)

        user = super(UserSerializer, self).update(instance, {**validated_data})
        return user


class PermissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Permission
        fields = ["id", "codename", "name"]


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = "__all__"
