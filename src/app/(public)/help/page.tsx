'use client'

import { Link } from '@/components/link'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CreditCard, Mail, Package, Share2 } from 'lucide-react'

export default function Page() {
  return (
    <div className='container mx-auto py-12 px-4 max-w-3xl'>
      <div className='space-y-10'>
        <div>
          <h1 className='text-3xl font-medium'>Help Center</h1>
          <p className='text-muted-foreground mt-2'>Learn how to use our platform to sell your digital products.</p>
        </div>

        <Tabs defaultValue='getting-started' className='w-full'>
          <TabsList className='grid w-full grid-cols-4'>
            <TabsTrigger value='getting-started'>Login</TabsTrigger>
            <TabsTrigger value='payments'>Stripe</TabsTrigger>
            <TabsTrigger value='products'>Products</TabsTrigger>
            <TabsTrigger value='sharing'>Sharing</TabsTrigger>
          </TabsList>

          <TabsContent value='getting-started' className='mt-6 space-y-6'>
            <div className='flex items-center gap-2'>
              <Mail className='h-5 w-5 text-primary' />
              <h2 className='text-xl font-medium'>Login with Email</h2>
            </div>

            <Separator />

            <div className='space-y-6'>
              <div className='space-y-2'>
                <h3 className='font-medium'>How it works</h3>
                <p className='text-muted-foreground'>
                  We use a passwordless login system with magic links and verification codes.
                </p>
              </div>

              <ol className='space-y-4 list-decimal ml-5'>
                <li>
                  <p className='font-medium'>Enter your email</p>
                  <p className='text-muted-foreground'>Provide your email address on the login page.</p>
                </li>

                <li>
                  <p className='font-medium'>Check your inbox</p>
                  <p className='text-muted-foreground'>We'll send you an email with a 6-digit verification code.</p>
                </li>

                <li>
                  <p className='font-medium'>Enter the code</p>
                  <p className='text-muted-foreground'>
                    Type the 6-digit code on the verification page to access your account.
                  </p>
                </li>
              </ol>

              <p className='text-sm text-muted-foreground'>
                Note: Verification codes expire after 10 minutes. Request a new one if needed.
              </p>
            </div>
          </TabsContent>

          <TabsContent value='payments' className='mt-6 space-y-6'>
            <div className='flex items-center gap-2'>
              <CreditCard className='h-5 w-5 text-primary' />
              <h2 className='text-xl font-medium'>Connect Stripe</h2>
            </div>

            <Separator />

            <div className='space-y-6'>
              <div className='space-y-2'>
                <h3 className='font-medium'>Connecting your account</h3>
                <p className='text-muted-foreground'>Link your Stripe account to receive payments from customers.</p>
              </div>

              <ol className='space-y-4 list-decimal ml-5'>
                <li>
                  <p className='font-medium'>Go to Settings</p>
                  <p className='text-muted-foreground'>Navigate to the Settings section in your dashboard.</p>
                </li>

                <li>
                  <p className='font-medium'>Find Payment Settings</p>
                  <p className='text-muted-foreground'>Look for the Payment or Stripe section.</p>
                </li>

                <li>
                  <p className='font-medium'>Connect with Stripe</p>
                  <p className='text-muted-foreground'>
                    Click the "Connect with Stripe" button and follow the prompts.
                  </p>
                </li>

                <li>
                  <p className='font-medium'>Complete verification</p>
                  <p className='text-muted-foreground'>
                    Provide any required information to verify your Stripe account.
                  </p>
                </li>
              </ol>

              <p className='text-sm text-muted-foreground'>
                You can create a new Stripe account during this process if you don't already have one.
              </p>
            </div>
          </TabsContent>

          <TabsContent value='products' className='mt-6 space-y-6'>
            <div className='flex items-center gap-2'>
              <Package className='h-5 w-5 text-primary' />
              <h2 className='text-xl font-medium'>Create Products</h2>
            </div>

            <Separator />

            <div className='space-y-6'>
              <div className='space-y-2'>
                <h3 className='font-medium'>Adding a new product</h3>
                <p className='text-muted-foreground'>Create digital products to sell on our platform.</p>
              </div>

              <ol className='space-y-4 list-decimal ml-5'>
                <li>
                  <p className='font-medium'>Go to Products</p>
                  <p className='text-muted-foreground'>Navigate to the Products section in your dashboard.</p>
                </li>

                <li>
                  <p className='font-medium'>Create New Product</p>
                  <p className='text-muted-foreground'>Click the "Create New Product" or "+" button.</p>
                </li>

                <li>
                  <p className='font-medium'>Add product details</p>
                  <p className='text-muted-foreground'>Enter the name, description, price, and upload any files.</p>
                </li>

                <li>
                  <p className='font-medium'>Save your product</p>
                  <p className='text-muted-foreground'>Click "Save" or "Publish" to make your product available.</p>
                </li>
              </ol>

              <div className='space-y-2 mt-6'>
                <h3 className='font-medium'>Supported product types</h3>
                <ul className='list-disc ml-5 space-y-1 text-muted-foreground'>
                  <li>Digital downloads (PDFs, images, software)</li>
                  <li>Memberships and subscriptions</li>
                  <li>Services</li>
                  <li>Online courses</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='sharing' className='mt-6 space-y-6'>
            <div className='flex items-center gap-2'>
              <Share2 className='h-5 w-5 text-primary' />
              <h2 className='text-xl font-medium'>Share Links</h2>
            </div>

            <Separator />

            <div className='space-y-6'>
              <div className='space-y-2'>
                <h3 className='font-medium'>Sharing your products</h3>
                <p className='text-muted-foreground'>Get your product links and share them with potential customers.</p>
              </div>

              <ol className='space-y-4 list-decimal ml-5'>
                <li>
                  <p className='font-medium'>Find your product</p>
                  <p className='text-muted-foreground'>
                    Go to the Products section and locate the product you want to share.
                  </p>
                </li>

                <li>
                  <p className='font-medium'>Get the link</p>
                  <p className='text-muted-foreground'>Click the "Share" or "Copy Link" button next to your product.</p>
                </li>

                <li>
                  <p className='font-medium'>Share anywhere</p>
                  <p className='text-muted-foreground'>
                    Paste your product link on social media, emails, or your website.
                  </p>
                </li>
              </ol>

              <div className='space-y-2 mt-6'>
                <h3 className='font-medium'>Best places to share</h3>
                <ul className='list-disc ml-5 space-y-1 text-muted-foreground'>
                  <li>Social media profiles</li>
                  <li>Email newsletters</li>
                  <li>Your website or blog</li>
                  <li>Online communities related to your product</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className='text-center'>
          <p className='text-muted-foreground mb-4'>Need additional help?</p>
          <Link href='/contact' className={buttonVariants()}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  )
}
