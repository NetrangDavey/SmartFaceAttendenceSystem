import os
import face_recognition as fr
import cv2
import numpy as np


def encode_image(file=r'C:\Users\Vishal Davey\Desktop\Usable Projs\Classroom Face Detection Attendence\Backend\Backend_and_models\media\registered'):
    encoded={}
    
    for dp,dn,fnames in os.walk(file):
        for f in fnames:
            if(f.endswith('.png') or f.endswith('.jpg')):
                face=fr.load_image_file(f'{dp}/{f}')
                encoding=fr.face_encodings(face)[0]
                encoded[f.split('.')[0]]=encoding
    return encoded
def unknown_encoding(file):
    encoded={}
    for img in os.listdir(file):
        face=fr.load_image_file(f'{file}/{img}')
        encoding=fr.face_encodings(face)[0]
        encoded[img.split('.')[0]]=encoding
    return encoded
def detect(file):
    faces=encode_image()
    faces_encoded=list(faces.values())
    known_face_names=list(faces.keys())
    iname=os.listdir(file)[0]
    img=cv2.imread(f"{file}/{iname}")

    face_location=fr.face_locations(img)
    unknown_face_encoding=fr.face_encodings(img,face_location)

    face_name = []
    for face_encoding in unknown_face_encoding:
        matches=fr.compare_faces(faces_encoded,face_encoding)
        name="unknown"

        face_distences=fr.face_distance(faces_encoded,face_encoding)
        best_match_index=np.argmin(face_distences)

        if matches[best_match_index]:
            name=known_face_names[best_match_index]
        face_name.append(name)

    
    # while True:
    #     cv2.imshow('Video',img)
    #     if cv2.waitKey(1) & 0xFF == ord('q'):
    #         return face_name
    return face_name

if __name__ =='__main__':
    print(detect(r'C:\Users\Vishal Davey\Desktop\Usable Projs\Classroom Face Detection Attendence\Backend\Backend_and_models\media\2024-10-08'))