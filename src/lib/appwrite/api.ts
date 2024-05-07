import { ID, Query } from 'appwrite'
import { INewPost, INewUser, IUpdatePost } from "@/types"
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
      //@ts-expect-error - library conflict
      'top',
      100
    )

    if (!fileUrl) {
      console.warn('No file url found!')
    }

    return fileUrl
  } catch (error) {
    console.error(error)
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)

    return { status: 'ok' }
  } catch (error) {
    console.error(error)
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

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray
      }
    )

    if (!updatedPost) {
      throw Error
    }

    return updatedPost
  } catch (error) {
    console.error(error)
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    )

    if (!updatedPost) {
      throw Error
    }

    return updatedPost
  } catch (error) {
    console.error(error)
  }
}

export async function deleteSavedPost(recordId: string) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      recordId
    )

    if (!statusCode) {
      throw Error
    }

    return { statusCode: 'ok' }
  } catch (error) {
    console.error(error)
  }
}

export async function getPostById(postId: string) {
  try {
    return await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )
  } catch (error) {
    console.error(error)
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId
    }

    if (hasFileToUpdate) {
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

      image = {...image, imageUrl: fileUrl, imageId: uploadedFile.$id }
    }

    const tags = post.tags?.replace(/ /g, '').split(',') || []

    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags: tags,
      }
    )

    if (!updatedPost) {
      await deleteFile(post.imageId)
      return
    }

    return updatedPost
  } catch(error) {
    console.error(error)
  }
}
// @ts-expect-error library error
export async function deletePost(postId: string, imageId: string) {
  try {
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    )

    return { status: 'ok' }
  } catch(error) {
    console.error(error)
  }
}
