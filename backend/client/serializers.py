from rest_framework import serializers

from .models import Visit, DoctorSpecialization, DoctorDetails


class VisitsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Visit
        fields = ('id', 'visit_name', 'start_time', 'is_approved_by_doctor', 'is_visit_finished',
                  'description', 'created_at')


class DoctorDetailsSerializerPost(serializers.ModelSerializer):
    class Meta:
        model = DoctorDetails
        fields = ('id', 'doctor_number', 'user', 'doctor_specializations')


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = DoctorSpecialization
        fields = ('id', 'specialization_name')


class DoctorDetailsSerializerGet(serializers.ModelSerializer):
    doctor_specializations = SpecializationSerializer(many=True, read_only=True)

    class Meta:
        model = DoctorDetails
        fields = ('id', 'doctor_number', 'doctor_specializations')
