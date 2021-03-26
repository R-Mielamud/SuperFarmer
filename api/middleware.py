import json
import json.decoder

def data_middleware(get_response):
    def middleware(request):
        if request.body:
            try:
                request.POST = json.loads(request.body.decode())
            except json.decoder.JSONDecodeError:
                data = {}
                pairs = request.body.decode().split("&")

                for pair in pairs:
                    value = pair.split("=")
                    data[value[0]] = value[1]

        return get_response(request)

    return middleware
