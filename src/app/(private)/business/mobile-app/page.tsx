export default function MobileAppPage() {
  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Mobile App Guide
          </h1>
          <p className="text-muted-foreground mt-2">
            Follow these steps to install <strong>GymBrah</strong> as a mobile
            app on your device
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow">
          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                For <strong>iOS</strong> Users
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>
                  Open <strong>Safari</strong> and visit{" "}
                  <strong>GymBrah</strong>
                </li>
                <li>
                  Tap the <strong>Share</strong> button (box with arrow) at the
                  bottom of the screen
                </li>
                <li>
                  Scroll down and tap{" "}
                  <strong>&quot;Add to Home Screen&quot;</strong>
                </li>
                <li>
                  Tap <strong>&quot;Add&quot;</strong> to confirm
                </li>
              </ol>
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold">
                For <strong>Android</strong> Users
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                <li>
                  Open <strong>Chrome</strong> and visit{" "}
                  <strong>GymBrah</strong>
                </li>
                <li>
                  Tap the <strong>three dots menu</strong> in the top right
                </li>
                <li>
                  Tap <strong>&quot;Add to Home screen&quot;</strong>
                </li>
                <li>
                  Tap <strong>&quot;Add&quot;</strong> to confirm
                </li>
              </ol>
            </div>

            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm">
                Once installed, <strong>GymBrah</strong> will work like a native
                app with <strong>full-screen mode</strong> and{" "}
                <strong>offline capabilities</strong>. You&apos;ll find the app
                icon on your home screen for quick access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
