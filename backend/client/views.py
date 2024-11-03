from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from administration.serializers import UserSerializer
from .models import Visit, DoctorSpecialization, DoctorDetails
from .serializers import SpecializationSerializer, VisitsNonSensitiveData, AddVisitsSerializer, VisitsSerializer


class VisitsView(APIView):
    def get(self, request):
        user_visits = Visit.objects.filter(user=request.user.id, is_visit_finished=False).order_by('-start_time')

        serialized = VisitsSerializer(user_visits, many=True)

        return Response(serialized.data)


class DoctorVisits(APIView):
    def post(self, request, pk):
        copied = request.data.copy()
        copied['user'] = request.user.id

        visit_serialized = AddVisitsSerializer(data=copied)

        if visit_serialized.is_valid():
            visit_serialized.save()
            return Response('Ok', status=201)
        else:
            return Response(visit_serialized.errors, status=400)

    def get(self, request, pk):
        doctor_visits = Visit.objects.filter(doctor__user__id=pk)
        serialized_visits = VisitsNonSensitiveData(doctor_visits, many=True)
        return Response(serialized_visits.data, status=200)


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
