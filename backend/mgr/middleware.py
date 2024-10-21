# middleware.py

from django.utils.deprecation import MiddlewareMixin
import logging

logger = logging.getLogger(__name__)

class CustomHeadersMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        logger.debug('Processing response for %s', request.path)
        response['Access-Control-Allow-Origin'] = 'http://127.0.0.1:5173'
        response['Access-Control-Allow-Credentials'] = 'true'
        logger.debug('Set Access-Control-Allow-Origin and Access-Control-Allow-Credentials headers')
        return response
