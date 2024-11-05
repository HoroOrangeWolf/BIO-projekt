from rest_framework import serializers

from administration.serializers import SimpleUserSerializer
from .models import Visit, DoctorSpecialization, DoctorDetails


class AddVisitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ('id', 'visit_name', 'start_time',
                  'description', 'doctor', 'user')

class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorSpecialization
        fields = ('id', 'specialization_name')

class DoctorDetailsSerializerGet(serializers.ModelSerializer):
    doctor_specializations = SpecializationSerializer(many=True, read_only=True)

    class Meta:
        model = DoctorDetails
        fields = ('id', 'doctor_number', 'doctor_specializations')



class VisitsSerializer(serializers.ModelSerializer):
    doctor = DoctorDetailsSerializerGet(read_only=True)
    class Meta:
        model = Visit
        fields = (
            'id',
            'visit_name',
            'is_visit_finished',
            'description',
            'created_at',
            'doctor',
            'start_time'
        )

class VisitsNonSensitiveData(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ('start_time')


class DoctorDetailsSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = DoctorDetails
        fields = ('id', 'doctor_number', 'user', 'doctor_specializations')


class VisitsForDoctorSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(read_only=True)

    class Meta:
        model = Visit
        fields = [
            "id", "visit_name", "is_visit_finished", "description", "start_time", "created_at", "user",
        ]
