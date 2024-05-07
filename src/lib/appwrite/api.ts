import { ID, Query } from 'appwrite'
import { INewPost, INewUser } from "@/types"
import { account, appwriteConfig, avatars, database, storage } from "@/lib/appwrite/config.ts"

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name,
    )

    if (!newAccount) {
      return
    }

    const avatarUrl = avatars.getInitials(user.name)
    return await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      username: user.username,
    })
  } catch (error) {
    console.error(error)
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  email: string;
  name: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    return await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )
  } catch (error) {
    console.error(error)
  }
}

export async function signInAccount(user: {
  email: string;
  password: string;
}) {
  try {
    return await account.createEmailPasswordSession(user.email, user.password)
  } catch (error) {
    console.error(error)
  }
}

export async function getCurrentUser() {
  try {
    const currentAccount = await account.get()

    if (!currentAccount) {
      return
    }

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal('accountId', currentAccount.$id)]
    )

    if (!currentUser) {
      return
    }

    return currentUser.documents[0]
  } catch (error) {
    console.error(error)
  }
}

export async function signOutAccount() {
  try {
    return await account.deleteSession('current')
  } catch (error) {
    console.error(error)
  }
}

export async function createPost(post: INewPost) {
  try {
    const uploadedFile = await uploadFile(post.file[0])

    if (!uploadedFile) {
      console.warn('No uploaded file found!')

      return
    }

    const fileUrl = getFilePreview(uploadedFile.$id)

    if (!fileUrl) {
      await deleteFile(uploadedFile.$id)
      return
    }

    const tags = post.tags?.replace(/ /g, '').split(',') || []

    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    )

    if (!newPost) {
      await deleteFile(uploadedFile.$id)
      return
    }

    return newPost
  } catch(error) {
    console.error(error)
  }
}

export async function uploadFile(file: File) {
  try {
    return await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )

  } catch (error) {
    console.log(error)
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      //@ts-ignore
      'top',
      100
    )

    if (!fileUrl) {
      console.warn('No file url found!')
    }

    return fileUrl
  } catch (error) {
    console.log(error)
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: 'ok' }
  } catch (error) {
    console.log(error)
  }
}

export async function getRecentPosts() {
  const posts = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc('$createdAt'), Query.limit(20)]
  )

    if (!posts) {
      throw Error
    }

    return posts
}
