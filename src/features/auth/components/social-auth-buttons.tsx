"use client";

import type { OAuthStrategy } from "@clerk/nextjs/types";
import { Button } from "@/components/ui/button";


const GoogleIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg className="h-4 w-4 shrink-0 fill-current dark:fill-white" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.029-3.91 1.183-4.961 3.014-2.117 3.675-.54 9.103 1.51 12.067 1.002 1.45 2.188 3.076 3.754 3.015 1.51-.063 2.077-.978 3.896-.978 1.817 0 2.346.978 3.929.948 1.613-.03 2.645-1.478 3.626-2.919 1.135-1.657 1.602-3.26 1.627-3.344-.035-.015-3.125-1.198-3.156-4.778-.025-2.99 2.454-4.428 2.565-4.501-1.402-2.05-3.567-2.28-4.33-2.327-2.015-.164-3.546 1.04-4.5 1.04zm2.73-4.223c.806-.976 1.35-2.333 1.203-3.673-1.15.047-2.544.767-3.37 1.741-.74.852-1.387 2.227-1.211 3.541 1.28.1 2.572-.633 3.378-1.609z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="h-4 w-4 shrink-0 fill-current dark:fill-white" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path fill="#F25022" d="M1 1h10.5v10.5H1z" />
    <path fill="#7FBA00" d="M12.5 1h10.5v10.5H12.5z" />
    <path fill="#00A4EF" d="M1 12.5h10.5V23H1z" />
    <path fill="#FFB900" d="M12.5 12.5H23V23H12.5z" />
  </svg>
);



export const SOCIAL_AUTH_PROVIDERS: {
  strategy: OAuthStrategy;
  name: string;
  icon: React.ComponentType;
}[] = [
  { strategy: "oauth_google", name: "Google", icon: GoogleIcon },
  { strategy: "oauth_apple", name: "Apple", icon: AppleIcon },
  { strategy: "oauth_github", name: "GitHub", icon: GithubIcon },
  { strategy: "oauth_microsoft", name: "Microsoft", icon: MicrosoftIcon },
];

type SocialAuthButtonsProps = {
  onSelect: (strategy: OAuthStrategy) => Promise<void>;
  loadingStrategy: OAuthStrategy | null;
  disabled?: boolean;
  visible?: boolean;
};

export function SocialAuthButtons({
  onSelect,
  loadingStrategy,
  disabled = false,
  visible = true,
}: SocialAuthButtonsProps) {
  if (!visible) return null;

  return (
    <div className="space-y-4">
      {SOCIAL_AUTH_PROVIDERS.map((provider) => {
        const Icon = provider.icon;
        return (
          <Button
            key={provider.strategy}
            type="button"
            variant="outline"
            className="relative h-10 w-full flex items-center justify-center gap-3 font-medium border-muted-foreground/20 hover:bg-accent"
            disabled={disabled || loadingStrategy !== null}
            onClick={() => void onSelect(provider.strategy)}
          >
            <Icon />
            <span>
              {loadingStrategy === provider.strategy
                ? `Connecting to ${provider.name}…`
                : `Continue with ${provider.name}`}
            </span>
          </Button>
        );
      })}
      
      <div className="relative flex items-center pt-2">
        <div className="w-full border-t" />
        <span className="absolute left-1/2 -translate-x-1/2 bg-background px-3 text-xs text-muted-foreground tracking-wide uppercase">
          or
        </span>
      </div>
    </div>
  );
}
