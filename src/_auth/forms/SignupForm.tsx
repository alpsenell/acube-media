import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Link, useNavigate } from "react-router-dom"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validations"
import Spinner from "@/components/common/Spinner.tsx"
import { useToast } from '@/components/ui/use-toast'
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queryAndMutations.ts"
import { useUserContext } from "@/context/AuthContext.tsx"

const SignupForm = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { checkAuthUser } = useUserContext()

  const {
    mutateAsync: createUserAccount,
    isPending: isCreatingAccount
  } = useCreateUserAccount()

  const {
    mutateAsync: signInAccount
  } = useSignInAccount()

  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values)

    if (!newUser) {
      toast({
        variant: 'destructive',
        title: 'Something went wrong',
      })

      return
    }

    const session = await signInAccount({
      email: values.email, password: values.password
    })

    if (!session) {
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
      })

      return
    }

    const isLoggedIn = await checkAuthUser()

    if (isLoggedIn) {
      form.reset()

      navigate('/')
    } else {
      toast({
        variant: 'destructive',
        title: 'Sign in failed',
      })
    }
  }

  return (
    <Form {...form}>
      <div className="flex-center flex-col">
        <img
          className="w-12 mb-4"
          alt="Brand Logo"
          src="/assets/logos/logo.png"
        />

        <h2 className="h3-bold md:h2-bold pt-5 small:pt-12">Create an account</h2>
        <p className="text-light-3 small-medium md:base-regular">Enter you account details</p>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="shad-button_primary" type="submit">
            {isCreatingAccount
              ? <Spinner />
              : 'Sign Up'}
          </Button>

          <p className="text-sm text-light-2 text-center mt-2">
            Already have an account ?
            <Link to="/sign-in" className="text-primary-500 hover:text-amber-700 text-sm ml-1">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  )
}

export default SignupForm
