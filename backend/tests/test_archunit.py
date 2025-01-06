from pytestarch import get_evaluable_architecture, Rule, Module
from pytestarch import Architecture


# Przygotowanie architektury projektu
evaluable_architecture = get_evaluable_architecture(
    root_path="../../backend",  # Katalog nadrzędny
    module_path="../../backend"  # Folder aplikacji Django
)

evaluable_architecture['modules'] = [m.replace("backend.", "") for m in evaluable_architecture.modules]

print(evaluable_architecture.modules)

def test_client_serializers_import_both_models():
    rule = (
        Rule()
        .modules_that()
        .have_name_matching(r"^backend\.client\.serializers")
        .should()
        .import_modules_that()
        .have_name_matching(r"backend\.(administration\.serializers|client\.models)")
    )
    rule.assert_applies(evaluable_architecture)


def test_views_should_not_import_models():
    rule = (
        Rule()
        .modules_that()
        .have_name_matching(r"^backend\.client\.models")
        .should()
        .import_modules_that()
        .have_name_matching(r"^backend\.auth_api\.models")
    )
    rule.assert_applies(evaluable_architecture)

def test_modules_auth_api_should_not_import_anything_from_client():
    rule = (
        Rule()
        .modules_that()
        .have_name_matching(r"^backend\.auth_api\..*")
        .should_not()
        .import_modules_that()
        .have_name_matching(r"^backend\.client\..*")
    )
    rule.assert_applies(evaluable_architecture)

def test_modules_models_should_not_import_any_module():
    rule = (
        Rule()
        .modules_that()
        .have_name_matching(r"^backend\..*\.models$")
        .should_not()
        .import_modules_that()
        .have_name_matching(r"^backend\..*")
    )
    rule.assert_applies(evaluable_architecture)

def test_urls_should_import_only_modules_from_view():
    rule = (
        Rule()
        .modules_that()
        .have_name_matching(r"^backend\..*\.urls")
        .should()
        .import_modules_that()
        .have_name_matching(r"^backend\..*\.views")
    )
    rule.assert_applies(evaluable_architecture)