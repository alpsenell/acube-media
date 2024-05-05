import { ID, Query } from 'appwrite'
import { INewUser } from "@/types"
import { account, appwriteConfig, avatars, database } from "@/lib/appwrite/config.ts";

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
    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      email: newAccount.email,
      name: newAccount.name,
      imageUrl: avatarUrl,
      username: user.username,
    })

    return newUser
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
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    )

    return newUser
  } catch (error) {
    console.error(error)
  }
}

export async function signInAccount(user: {
  email: string;
  password: string;
}) {
  try {
    const session = await account.createEmailPasswordSession(user.email, user.password)

    return session
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
