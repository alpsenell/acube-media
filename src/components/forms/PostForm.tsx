import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from 'react-router-dom'

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea.tsx"
import FileUploader from "@/components/common/FileUploader.tsx"
import { Input } from "@/components/ui/input.tsx"
import { PostValidation } from "@/lib/validations"
import { Models } from "appwrite"
import { useUserContext } from "@/context/AuthContext.tsx"
import { useToast } from "@/components/ui/use-toast.ts"
import { useCreatePost, useUpdatePost } from "@/lib/react-query/queryAndMutations.ts"
import Spinner from "@/components/common/Spinner.tsx"

type PostFormProps = {
  post?: Models.Document;
  action: 'Create' | 'Update';
}

const PostForm = ({ post, action }: PostFormProps) => {
  const { mutateAsync: createPost, isPending: isLoadingCreate } = useCreatePost()
  const { mutateAsync: updatePost, isPending: isUpdatingPost } = useUpdatePost()
  const { user } = useUserContext()
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      caption: post ? post?.caption : '',
      file: [],
      location: post ? post?.location : '',
      tags: post ? post.tags.join(',') : ''
    },
  })

  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (post && action == 'Update') {
      const updatedPost = await updatePost({
        ...values,
        postId: post.$id,
        imageId: post?.imageId,
        imageUrl: post?.imageUrl
      })

      if (!updatedPost) {
        toast({
          title: 'Post update failed ! Please try again',
          variant: 'destructive',
        })
      }

      return navigate(`/post/${post.$id}`)
    }


    const newPost = await createPost({
      ...values,
      userId: user.id
    })

    if (typeof newPost === 'string') {
      toast({
        title: newPost,
        variant: 'destructive',
      })

      return
    }

    navigate('/')
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Caption</FormLabel>
              <FormControl>
                <Textarea
                  className="shad-textarea custom-scrollbar"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Photos</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={post?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Location</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Tags</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="shad-input"
                  placeholder="Gym, Art, Tech"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />

        <div className="flex gap4- items-center justify-end">
          <Button type="button" className="shad-button_dar_4">
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isUpdatingPost}
          >
            {isLoadingCreate || isUpdatingPost ? (
              <Spinner />
            ) : (
              `${action} Post`
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default PostForm
