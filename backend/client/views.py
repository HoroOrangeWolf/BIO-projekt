from rest_framework import viewsets
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.views import APIView

from administration.serializers import UserSerializer
from .models import Visit, DoctorSpecialization, DoctorDetails, MedicalDocumentation
from .serializers import SpecializationSerializer, VisitsNonSensitiveData, AddVisitsSerializer, VisitsSerializer, \
    VisitsForDoctorSerializer, VisitsForUserSerializer, VisitReadDocumentationSerializer


class VisitsView(APIView):
    def get(self, request):
        user_visits = Visit.objects.filter(user=request.user.id, is_visit_finished=False).order_by('-start_time')

        serialized = VisitsSerializer(user_visits, many=True)

        return Response(serialized.data)


class DoctorVisits(APIView):
    def post(self, request, pk):
        # TODO: Dodać walidacje czy czasy się pokrywają
        copied = request.data.copy()
        doctor_details = DoctorDetails.objects.filter(user__id=copied['doctor']).first()
        copied['user'] = request.user.id
        copied['doctor'] = doctor_details.id

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


class VisitsForUser(APIView):
    def delete(self, request, pk):
        visit = Visit.objects.get(id=pk)

        if visit is None:
            return Response("Not found", status=400)

        user_id = request.user.id

        if not visit.user.id == user_id:
            return Response("Nie masz dostępu do tej wizyty", status=403)

        if visit.is_visit_finished:
            return Response("Nie można usunąć zakończonej wizyty", status=400)

        visit.delete()

        return Response("Usunięto", status=200)

    def get(self, request):
        param = request.GET.get('isVisitFinished', 'False')

        param_lowercase = param.lower()

        is_visit_finished = param_lowercase == 'true'

        visits = Visit.objects.filter(user__id=request.user.id, is_visit_finished=is_visit_finished).order_by(
            '-start_time')
        serialized = VisitsForUserSerializer(visits, many=True)
        return Response(serialized.data, status=200)


class VisitDocumentation(APIView):
    def get(self, request):
        user_id = request.user.id

        documentation = MedicalDocumentation.objects.filter(visit__user__id=user_id)

        serialized = VisitReadDocumentationSerializer(documentation, many=True)

        return Response(serialized.data, status=200)


class VisitsForDoctor(viewsets.ModelViewSet):
    queryset = Visit.objects.all()
    serializer_class = VisitsForDoctorSerializer

    def list(self, request, *args, **kwargs):
        doctor_id = request.query_params.get('doctor')

        if doctor_id:
            visits = Visit.objects.filter(doctor_id=doctor_id)
        else:
            visits = []

        serializer = self.get_serializer(visits, many=True)
        return Response(serializer.data, status=200)
