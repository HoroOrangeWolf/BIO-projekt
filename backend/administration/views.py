from django.contrib.auth.models import Group, Permission
from django.core.serializers import serialize
from rest_framework import status
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from administration.serializers import UserSerializer, GroupSerializer, PermissionSerializer, UpdateUserSerializer
from auth_api.models import AuthUser
from client.models import DoctorSpecialization, DoctorDetails
from client.serializers import DoctorDetailsSerializerPost
from mgr.utils import CustomPagination, IsUserWithSpecialPermission


class UserView(APIView):
    app_label = "auth"
    # filter_backends = [DjangoFilterBackend]
    # filterset_class = UserFilter
    # ordering
    pagination_class = CustomPagination
    permission_classes = [IsUserWithSpecialPermission]

    def get(self, request):
        users = AuthUser.objects.all().order_by("id")
        # filterset = self.filterset_class(request.GET, queryset=users)
        # if not filterset.is_valid():
        #     return Response(filterset.errors, status=status.HTTP_400_BAD_REQUEST)
        # users = filterset.qs

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(users, request)
        if page is not None:
            serializer = UserSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            serializer = UserSerializer(users, many=True)
            return Response(serializer.data)

    def put(self, request, pk):
        user = AuthUser.objects.get(id=pk)

        if user is None:
            raise NotFound("Not found user")

        serializer = UpdateUserSerializer(user, data=request.data['user'])

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        if request.data['details'] is not None:
            details = DoctorDetails.objects.filter(user=pk).first()

            if details is not None:
                clone = request.data['details'].copy()
                clone['user'] = user.id
                details_serializer = DoctorDetailsSerializerPost(details, data=clone)

                if details_serializer.is_valid():
                    details_serializer.save()
                    return Response("Ok", status=200)
                else:
                    return Response(details_serializer.errors, status=400)

            clone = request.data['details'].copy()
            clone['user'] = user.id
            details_serializer = DoctorDetailsSerializerPost(data=clone)

            if details_serializer.is_valid():
                details_serializer.save()
                return Response("Created", status=201)
            else:
                return Response(details_serializer.errors, status=400)
        else:
            details = DoctorDetails.objects.filter(user=pk).first()

            if details is None:
                return Response("Created user", status=201)
            else:
                details.delete()

        return Response("Created user", status=201)

    def post(self, request):
        serializer = UserSerializer(data=request.data['user'])

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()

        if request.data['details'] is not None:
            clone = request.data['details'].copy()
            clone['user'] = user.id
            details_serializer = DoctorDetailsSerializerPost(data=clone)

            if details_serializer.is_valid():
                details_serializer.save()
                return Response("Created", status=201)
            else:
                return Response(details_serializer.errors, status=400)

        return Response("Created user", status=201)

    def delete(self, request, pk):
        try:
            user = AuthUser.objects.get(pk=pk)
        except AuthUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        try:
            user = AuthUser.objects.get(pk=pk)
        except AuthUser.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GroupView(APIView):
    app_label = "auth"
    # filter_backends = [DjangoFilterBackend]
    # filterset_class = GroupFilter
    # ordering
    pagination_class = CustomPagination
    permission_classes = [IsUserWithSpecialPermission]

    def get(self, request):
        groups = Group.objects.all().order_by("id")
        # filterset = self.filterset_class(request.GET, queryset=groups)
        # if not filterset.is_valid():
        #     return Response(filterset.errors, status=status.HTTP_400_BAD_REQUEST)
        # groups = filterset.qs

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(groups, request)
        if page is not None:
            serializer = GroupSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            serializer = GroupSerializer(groups, many=True)
            return Response(serializer.data)

    def post(self, request):
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            group = Group.objects.get(pk=pk)
        except Group.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        group.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def patch(self, request, pk):
        try:
            group = Group.objects.get(pk=pk)
        except Group.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = GroupSerializer(group, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class PermissionView(APIView):
    app_label = "auth"
    # filter_backends = [DjangoFilterBackend]
    # filterset_class = PermissionFilter
    # ordering
    pagination_class = CustomPagination
    permission_classes = [IsUserWithSpecialPermission]

    def get(self, request):
        permissions = Permission.objects.all().order_by("id")
        # filterset = self.filterset_class(request.GET, queryset=permissions)
        # if not filterset.is_valid():
        #     return Response(filterset.errors, status=status.HTTP_400_BAD_REQUEST)
        # users = filterset.qs

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(permissions, request)
        if page is not None:
            serializer = PermissionSerializer(page, many=True)
            return paginator.get_paginated_response(serializer.data)
        else:
            serializer = PermissionSerializer(permissions, many=True)
            return Response(serializer.data)
