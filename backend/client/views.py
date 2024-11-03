from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from administration.serializers import UserSerializer
from auth_api.models import AuthUser
from .models import Visit, DoctorSpecialization, DoctorDetails
from .serializers import VisitsSerializer, SpecializationSerializer


class VisitsView(APIView):
    def post(self, request):
        user_id = request.user.id
        copy_request = request.data.copy()
        copy_request['user'] = user_id
        visit_instance = VisitsSerializer(data=copy_request)

        if visit_instance.is_valid():
            visit_instance.save()
            return Response("Saved visit", status=200)
        else:
            return Response(visit_instance.errors, status=400)

    def get(self, request):
        user_visits = Visit.objects.filter(user=request.user.id, is_visit_finished=False).order_by('-start_time')

        serialized = VisitsSerializer(user_visits, many=True)

        return Response(serialized.data)


class DoctorView(APIView):
    def get(self, request, pk):
        doctors = DoctorDetails.objects.filter(doctor_specializations__id=pk)

        users = []

        for x in doctors:
            users.append(x.user)

        serialized = UserSerializer(users, many=True)

        return Response(serialized.data, status=200)


class SpecializationView(APIView):
    def get(self, request):
        specializations = DoctorSpecialization.objects.all()
        serialized = SpecializationSerializer(specializations, many=True)
        return Response(serialized.data)

    def put(self, request, pk):
        specialization = DoctorSpecialization.objects.get(id=pk)

        serialized = SpecializationSerializer(specialization, data=request.data)

        if serialized.is_valid():
            serialized.save()
            return Response("Saved data", status=200)
        else:
            return Response(serialized.errors, status=400)

    def delete(self, request, pk):
        try:
            specialization = DoctorSpecialization.objects.get(id=pk)
        except DoctorSpecialization.DoesNotExist:
            raise NotFound("Not found")

        specialization.delete()

        return Response("Removed", status=200)

    def post(self, request):
        instance = SpecializationSerializer(data=request.data)

        if instance.is_valid():
            instance.save()
            return Response('Saved specialization', status=200)
        else:
            return Response(instance.errors, status=400)
