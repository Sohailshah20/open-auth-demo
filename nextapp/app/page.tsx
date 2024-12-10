import { cookies } from 'next/headers';

export default async function Home() {
  const cookieStore = await cookies();
  const userName = cookieStore.get('userName')?.value || 'User';

  return (
    <div className="flex items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold text-center">
        Hello {userName}
      </h1>
    </div>
  );
}