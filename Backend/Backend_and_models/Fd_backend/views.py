import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .face_detect import detect
import base64
import os
import datetime
from .models import Students

@csrf_exempt
def mark_attendance(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            image_data = data.get('image')

            if image_data:
                # Remove the metadata (e.g., "data:image/png;base64,")
                format, imgstr = image_data.split(';base64,')
                ext = format.split('/')[-1]  # Get the extension

                # Decode the image
                imgdata = base64.b64decode(imgstr)
                file_name = f"attendance_image.{ext}"
                sub_fol=str(datetime.date.today())
                if(not(sub_fol in os.listdir('media/unknown'))):
                    os.mkdir(f'media/unknown/{sub_fol}')
                file_path = os.path.join(f'media/unknown/{sub_fol}', file_name)

                # Save the image
                with open(file_path, 'wb') as f:
                    f.write(imgdata)
                result=detect(f'media/unknown/{sub_fol}')
                names=[]
                for r in result:
                    data=Students.objects.get(reg_no=r)
                    if data:
                        names.append(data.name)
                
                return JsonResponse({'message': 'Attendence Marked successfully!',
                                     'Students':names,
                                     'Registration Numbers':result,
                                     'Date':sub_fol,
                                     'total stds':len(result)})
            else:
                return JsonResponse({'error': 'No image data provided!'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method!'}, status=405)


@csrf_exempt
def register(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            image_data = data.get('image')
            name=data.get('username')
            regis=data.get('reg')
            if image_data:
                # Remove the metadata (e.g., "data:image/png;base64,")
                format, imgstr = image_data.split(';base64,')
                ext = format.split('/')[-1]  # Get the extension

                # Decode the image
                imgdata = base64.b64decode(imgstr)
                file_name = f"{regis}.{ext}"
                
                file_path = os.path.join('media/registered/', file_name)

                # Save the image
                with open(file_path, 'wb') as f:
                    f.write(imgdata)
                Students(name=name,reg_no=regis).save()
                return JsonResponse({'message': 'Image uploaded successfully!',
                                     'Students_name':name})
            else:
                return JsonResponse({'error': 'No image data provided!'}, status=400)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    return JsonResponse({'error': 'Invalid request method!'}, status=405)
