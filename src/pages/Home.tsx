import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonItem, IonIcon, IonLabel,  IonContent, IonPage, IonHeader, IonToolbar, IonTitle, useIonViewWillEnter, IonToast, IonInput, IonButton, IonList } from '@ionic/react';
import { personAdd,logIn, addOutline, trashBinOutline, pencil } from 'ionicons/icons';
import './Home.css';
import { useState,useEffect } from 'react';
import firebase from 'firebase/app'
import 'firebase/firebase-firestore';
import {user} from '../modelo/user'
import { firebaseConfig } from '../firebaseConfig';
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const Home: React.FC = () => {
  const [listUsers, setListUsers] = useState < user[] > ([]); 
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail]= useState('');
    const [country, setCounty]= useState('');
    const [mensaje, setMensaje] = useState(false);
    const [bandera, setBandera] = useState(true);
    const getlistUser = async () => {
      try {
          let list: user[] = []
          const res = await firebase.firestore().collection('usuarios').get();
          res.forEach((doc) => {
              let obj = {
                  id: doc.id,
                  name: doc.data().name,
                  email: doc.data().email,
                  country: doc.data().country
              };
              list.push(obj)
  
          });
          setListUsers(list)
      } catch (error) {}
  }

  const createUser= async () => {
      try {
          if(bandera){
              await firebase.firestore().collection('usuarios').add(
                  {name,email,country});
                 
          }else{
              await firebase.firestore().collection('usuarios').doc(id).set(
                {name,email,country});
                  setBandera(true);
          }
           
      } catch (error) {}
      setId('');
      setName('');
      setEmail('');
      setCounty('');
      setMensaje(true);
      getlistUser();  
  }


  const deleteUser = async(id:string) =>{
      try {
          console.log(id)
          await firebase.firestore().collection('usuarios').doc(id).delete();
          getlistUser();  
      } catch (error) {}       
  }

  const updateUser = (id:string,name:string,email:string,country:string) => {
    setId(id);
    setName(name);
    setEmail(email);
    setCounty(country)
    setBandera(false);
} 

  useIonViewWillEnter(() => {
      getlistUser();
  })

  return (
    <IonPage>
        <IonToast
           isOpen={mensaje}
           onDidDismiss={() => setMensaje(false)}
           message="usuario guardado"
           duration={500}
          />
            <IonHeader>
                <IonToolbar >
                    <IonTitle>CRUD IONIC REACT FIREBASE</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>

                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">Usuario</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonCard>
                    <IonItem>
                        <IonInput value={name}
                            placeholder="Nombre Usuario"
                            onIonChange={ e => setName(e.detail.value!) }
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput value={email}
                            placeholder="Email"
                            onIonChange={ e => setEmail(e.detail.value!) }
                        ></IonInput>
                    </IonItem>
                    <IonItem>
                        <IonInput value={country}
                            placeholder="Ciudad"
                            onIonChange={ e => setCounty(e.detail.value!) }
                        ></IonInput>
                    </IonItem>
                <IonButton color="success" expand="block"
                    onClick={() => createUser() }>
                        <IonIcon icon={addOutline}>
                        </IonIcon>{bandera?'Usuario':'Editar'}</IonButton>
                </IonCard>
                <IonList> {
                    listUsers.map(user => (
                        <IonCard key={user.id} >
                            <IonCardHeader>
                                <IonCardTitle>Nombre:{
                                    user.name
                                }</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                Email: {user.email} 
                                Ciudad: {user.country}
                                <IonButton color="danger" expand="block"
                               onClick={() => deleteUser(''+user.id)}>
                             <IonIcon icon={trashBinOutline}></IonIcon>
                               Eliminar</IonButton>  
                        <IonButton color="tertiary" expand="block"
                         onClick={
                    () => updateUser(''+user.id,''+user.name,''+user.country,''+user.email)}>
                             <IonIcon icon={pencil}></IonIcon>Editar</IonButton>   
                            </IonCardContent>
                        </IonCard>
                    )) }
                 </IonList>
            </IonContent>
        </IonPage>
  );
};

export default Home;
