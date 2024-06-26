import {
    DocumentData, DocumentReference, addDoc, collection, deleteDoc, doc,
    getDoc, getDocs, query, setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';
import { db, genreNameDB, genreNameUI } from './init'
import { PlaylistDAO } from './types';
import { session } from '@/spotify/sessions';
import { Playlist } from '@/spotify';

export async function getPlaylists(genres?: string[]): Promise<PlaylistDAO[]> {
    try {
        console.log('getPlaylists');

        if (genres) {
            if (genres.length === 0) {
                return [];
            }

            const dbGenres: string[] = genres.map(genre => genreNameDB(genre));
            const playlistsSnapshot = await getDocs(
                query(
                    collection(db, `/users/${session.userProfile.id}/playlists`),
                    where('name', 'in', dbGenres)
                )
            );
            return Promise.all(playlistsSnapshot.docs.map(async doc => {
                const playlist = doc.data() as PlaylistDAO;
                playlist.genre = genreNameUI(playlist.genre);
                return playlist;
            }));
        } else {
            const playlistsSnapshot = await getDocs(
                collection(db, `/users/${session.userProfile.id}/playlists`)
            );

            return Promise.all(playlistsSnapshot.docs.map(async doc => {
                const playlist = doc.data() as PlaylistDAO;
                playlist.genre = genreNameUI(playlist.genre);
                return playlist;
            }));
        }
    } catch (error) {
        throw new Error(`@/database/getPlaylists: ${error}`);
    }
}

export async function addPlaylist(
    genre: string, createSpotifyPlaylist: () => Promise<Playlist>
): Promise<DocumentReference<DocumentData, DocumentData>> {
    try {
        const genreDB = genreNameDB(genre);
        const playlistDocRef = doc(
            db, `/users/${session.userProfile.id}/playlists/${genre}`
        );
        const playlistSnapshot = await getDoc(playlistDocRef);

        if (!playlistSnapshot.exists()) {
            const playlist = await createSpotifyPlaylist();
            await setDoc(playlistDocRef, {
                id: playlist.id,
                name: playlist.name,
                genre: genre,
                description: playlist.description || '',
                imageURI: playlist.images[0] ? playlist.images[0].url : null,
                url: playlist.external_urls.spotify,
                tracks: [],
            });

            const genresDocRef = doc(
                db, `/users/${session.userProfile.id}/genres/${genreDB}`
            );
            await setDoc(genresDocRef, {
                name: genreNameUI(genre),
                count: 0,
            });
        }

        return playlistDocRef;
    } catch (error) {
        throw new Error(`@/database/addPlaylist: ${error}`);
    }
}

export async function editPlaylist(
    genre: string,
    name: string,
    description: string,
    imageURI?: string | null,
): Promise<void> {
    try {
        const genreDB = genreNameDB(genre);
        const playlistDocRef = doc(
            db, `/users/${session.userProfile.id}/playlists/${genreDB}`
        );
        await updateDoc(playlistDocRef, {
            name: name,
            description: description,
        });
    } catch (error) {
        throw new Error(`@/database/editPlaylist: ${error}`);
    }
}

export async function editPlaylistImage(
    genre: string,
    imageURI: string | null,
): Promise<void> {
    try {
        const genreDB = genreNameDB(genre);
        const playlistDocRef = doc(
            db, `/users/${session.userProfile.id}/playlists/${genreDB}`
        );
        await updateDoc(playlistDocRef, {
            imageURI: imageURI,
        });
    } catch (error) {
        throw new Error(`@/database/editPlaylistImage: ${error}`);
    }
}

export async function removePlaylist(genre: string): Promise<string | null> {
    try {
        const genreDB = genreNameDB(genre);
        const playlistDocRef = doc(
            db, `/users/${session.userProfile.id}/playlists/${genreDB}`
        );
        const playlistSnapshot = await getDoc(playlistDocRef);
        const playlistData = playlistSnapshot.data();
        const playlistID: string | null = playlistData ? playlistData.id : null;

        await deleteDoc(playlistDocRef);
        return playlistID;
    } catch (error) {
        throw new Error(`@/database/removePlaylist: ${error}`);
    }
}