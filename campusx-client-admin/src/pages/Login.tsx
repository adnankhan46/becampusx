import authService, { CompanyData } from "@/api/api.auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import useCompanyStore from "@/store/store"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import { useNavigate } from "react-router"

function Login() {
  const { setCompany } = useCompanyStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [resdata, setResdata] = useState<CompanyData | null>(null);
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
    console.log(username);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    console.log(password)
  };

  const loginMutation = useMutation({
    mutationFn: authService.Login,
    onSuccess: (data) => {
      console.log(data);
      setResdata(data);
      setCompany(data);
      console.log("token: ", data.token);
      
      navigate('/Dashboard');
     },
    onError: (error) => {
      console.log(error);
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if(!username || !password) {
      return alert('Enter valid credentials')
    }
    
    loginMutation.mutate({username, password});

  }

  return (
    <section className="flex h-screen w-full items-center justify-center">
      <Card className="overflow-hidden w-full max-w-6xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your CampusX account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  value={username}
                  onChange={handleUsernameChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                id="password"
                placeholder="Password"
                type="password" 
                value={password}
                onChange={handlePasswordChange}
                required />
              </div>
              <Button type="submit" onClick={handleLogin} className="w-full">
                Login
              </Button>
              
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                  Sign up
                </a>
                {resdata ? JSON.stringify(resdata) : null}
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="https://framerusercontent.com/images/ZREx5DCRX2R5bVduQbT5cwGds.png"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

export default Login
