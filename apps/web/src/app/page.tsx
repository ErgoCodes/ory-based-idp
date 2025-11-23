export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">Login/Consent Provider</h1>
        <p className="text-sm text-gray-600 max-w-md">
          This application provides login and consent screens for OAuth2/OIDC authentication.
          <br />
          <br />
          Users are redirected here by Hydra when an OAuth2 client requests authentication.
        </p>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-left text-sm">
          <p className="font-medium mb-2">Available endpoints:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>/oauth2/login - Login page</li>
            <li>/oauth2/consent - Consent page</li>
            <li>/oauth2/logout - Logout page</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
