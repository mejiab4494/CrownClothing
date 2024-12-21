import { initializeApp } from 'firebase/app';
import { getAuth, signInWithRedirect, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut,
  onAuthStateChanged
 } from 'firebase/auth'
import { getFirestore, doc, getDoc, setDoc, collection, writeBatch, query, getDocs} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCgJcWWRWPJRL4XU0HiaJmKiIZQeetC0y4",
    authDomain: "crwn-clothing-e76ef.firebaseapp.com",
    projectId: "crwn-clothing-e76ef",
    storageBucket: "crwn-clothing-e76ef.firebasestorage.app",
    messagingSenderId: "6389520526",
    appId: "1:6389520526:web:3c1a96ea21782e21c151df"
  };
  
  // Initialize Firebase
  const firebaseApp = initializeApp(firebaseConfig);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account"
  });

  export const auth = getAuth();
  export const signInWithGooglePopup = () => signInWithPopup(auth, provider);
  export const signInWithGoogleRedirect = () => signInWithRedirect(auth, provider);

  export const db = getFirestore();

  export const addCollectionAndDocuments = async(collectionKey, objectsToAdd) => {
    const collectionRef = collection(db, collectionKey);
    const batch = writeBatch(db);

    objectsToAdd.forEach((object) => {
      const docRef = doc(collectionRef, object.title.toLowerCase());
      batch.set(docRef, object); 
    })

    await batch.commit();
    console.log('done');
  };

  export const getCategoriesAndDocuments = async () => {
    const collectionRef = collection(db, 'categories');
    const q = query(collectionRef);

    const querySnapshot = await getDocs(q);
    const categoryMap = querySnapshot.docs.reduce((acc, docSnapshot) => {
      const { title, items } = docSnapshot.data();
      acc[title.toLowerCase()] = items;
      return acc;
    }, {});

    return categoryMap;
  }

  export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {displayName: ''}) => {
    if(!userAuth) return;

    const userDocRef = doc(db, 'users', userAuth.uid);

    const userSnapShot = await getDoc(userDocRef);

    if(!userSnapShot.exists()) {
      const { displayName, email } = userAuth;
      const createAt = new Date();

      try  {
        await setDoc(userDocRef, {
          displayName,
          email,
          createAt,
          ...additionalInformation
        }) 
        
      } catch (error) {
          switch(error.code) {
            case 'auth/wrong-password':
              alert('incorrect password for email');
              break
            case "auth/user-not-found":
              alert('no user associated with this email');
              break;
            default:
              console.log(error);
          }
        }
      };

      return userDocRef;

    }

    export const createAuthUserWithEmailAndPassword = async (email, password) => {
      if(!email || !password) return;
      return await createUserWithEmailAndPassword(auth, email, password);
    };

    export const signInAuthUserWithEmailAndPassword = async (email, password) => {
      if(!email || !password) return;

      return await signInWithEmailAndPassword(auth, email, password);
    };

    export const signOutUser = async () => await signOut(auth);

    export const onAuthStateChangedListener = (callback) => onAuthStateChanged(auth, callback);