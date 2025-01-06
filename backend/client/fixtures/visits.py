import json
from datetime import datetime, timedelta
import random

def generate_visits_and_docs_fixture():
    # Konfiguracja
    app_name = "client"  # <- Zmień na właściwą nazwę swojej aplikacji
    # Doktorzy: DoctorDetails.pk = 1..3
    doctors = [1, 2, 3]
    # Pacjenci: AuthUser.pk = 4..13
    patients = list(range(4, 8))
    # Pliki dokumentacji
    doc_files = ["plik1.pdf", "plik2.pdf", "plik3.docx", "plik4.docx"]

    # Data startowa (najbliższy poniedziałek) – przykładowo:
    start_date = datetime(2025, 1, 13)
    # Generujemy 2 tygodnie, poniedziałek-piątek (10 dni roboczych)
    total_weeks = 2
    days_per_week = 5
    total_days = total_weeks * days_per_week

    # Godziny od 9:00 do 15:00 co 30 min
    visit_start = 9
    visit_end = 15
    visit_interval = 30  # w minutach

    # Listy na końcowe dane do fixtury
    fixture_list = []

    visit_pk = 1
    doc_pk = 1

    current_day = start_date
    days_generated = 0

    # Indeksy do round-robin (jeśli nie chcesz losować)
    doctor_index = 0
    patient_index = 0

    while days_generated < total_days:
        # weekend?
        if current_day.weekday() >= 5:
            # sobota(5) / niedziela(6)
            current_day += timedelta(days=1)
            continue

        # generowanie wizyt w danym dniu
        slot_time = current_day.replace(hour=visit_start, minute=0, second=0, microsecond=0)
        end_time = current_day.replace(hour=visit_end, minute=0, second=0, microsecond=0)

        while slot_time < end_time:
            # wybór lekarza (round-robin lub random)
            doctor = doctors[doctor_index]
            doctor_index = (doctor_index + 1) % len(doctors)

            # wybór pacjenta (round-robin lub random)
            patient = patients[patient_index]
            patient_index = (patient_index + 1) % len(patients)

            # tworzę obiekt Visit
            visit_obj = {
                "model": f"{app_name}.visit",
                "pk": visit_pk,
                "fields": {
                    "visit_name": f"Wizyta {slot_time.strftime('%Y-%m-%d %H:%M')}",
                    "start_time": slot_time.isoformat(),
                    "is_visit_finished": False,
                    "description": f"Opis wizyty z {slot_time.strftime('%Y-%m-%d %H:%M')}",
                    "created_at": datetime.now().isoformat(),
                    "doctor": doctor,  # DoctorDetails PK
                    "user": patient    # AuthUser PK
                }
            }

            fixture_list.append(visit_obj)

            # Tworzę obiekt MedicalDocumentation (1 plik na wizytę)
            chosen_file = random.choice(doc_files)
            doc_obj = {
                "model": f"{app_name}.medicaldocumentation",
                "pk": doc_pk,
                "fields": {
                    "file": f"medical_docs/{chosen_file}",
                    "file_name": chosen_file,
                    "file_description": f"Dokumentacja do wizyty {visit_pk}",
                    "visit": visit_pk
                }
            }

            fixture_list.append(doc_obj)

            # Inkrementacja
            visit_pk += 1
            doc_pk += 1
            slot_time += timedelta(minutes=visit_interval)

        # przejście do kolejnego dnia roboczego
        current_day += timedelta(days=1)
        days_generated += 1

    return fixture_list


if __name__ == "__main__":
    data = generate_visits_and_docs_fixture()
    with open("visits_and_docs_fixture.json", "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print("Plik visits_and_docs_fixture.json wygenerowany.")
