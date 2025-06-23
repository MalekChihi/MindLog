// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { router } from 'expo-router';

// export type AuthContextType = {
//   user: any; // Replace with specific user model if defined
//   signIn: (userData: any) => Promise<void>;
//   signOut: () => Promise<void>;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// type AuthProviderProps = {
//   children: ReactNode;
// };

// export const AuthProvider = ({ children }: AuthProviderProps) => {
//   const [user, setUser] = useState<any>(null);

//   useEffect(() => {
//     const loadUser = async () => {
//       try {
//         const storedUser = await AsyncStorage.getItem('user');
//         if (storedUser) {
//           setUser(JSON.parse(storedUser));
//         }
//       } catch (error) {
//         console.error('Failed to load user from storage:', error);
//       }
//     };

//     loadUser();
//   }, []);

//   const signIn = async (userData: any) => {
//     try {
//       await AsyncStorage.setItem('user', JSON.stringify(userData));
//       setUser(userData);
//     } catch (error) {
//       console.error('Failed to sign in:', error);
//     }
//   };

//   const signOut = async () => {
//     try {
//       await AsyncStorage.removeItem('user');
//       await AsyncStorage.removeItem('access_token');
//       setUser(null);
//       router.replace('/sign-in');
//     } catch (error) {
//       console.error('Failed to sign out:', error);
//     }
//   };

//   return (
//     <AuthContext.Provider value={{ user, signIn, signOut }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
