import type { LocaleMessages } from "./zh-CN"

const enUS: LocaleMessages = {
  common: {
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Copy failed, please copy it manually",
    backHome: "Back to home",
    retry: "Retry",
    learnMore: "Learn more",
    github: "GitHub",
    openMenu: "Open navigation menu",
    skipToContent: "Skip to main content",
    loading: "Loading…",
  },
  nav: {
    home: "Home",
    components: "Components",
    about: "About",
  },
  theme: {
    toLight: "Switch to light mode",
    toDark: "Switch to dark mode",
  },
  language: {
    label: "Change language",
    "zh-CN": "简体中文",
    "en-US": "English",
  },
  footer: {
    license: "Released under the MIT License",
    builtWith: "Built with shadcn/ui and QiuYe UI",
  },
  home: {
    hero: {
      badge: "v3 · Rebuilt on shadcn/ui 4",
      title: "Build better React apps.",
      words: ["Modern.", "Elegant.", "Consistent.", "Versatile."],
      description:
        "Vite 8, React 19, TypeScript and Tailwind CSS 4 on top of the official shadcn/ui, with routing, data fetching, state, i18n, theming and motion ready to go — plus first-class QiuYe UI support.",
      primary: "Browse components",
      secondary: "View source",
      commandLabel: "Create a project",
    },
    stack: {
      title: "Tech stack",
      description:
        "Every dependency is on its current stable release. Versions below are read straight from package.json.",
      items: {
        vite: "Next-gen tooling with Rolldown-powered dev and builds",
        react: "Concurrent rendering, Actions and new hooks",
        typescript: "Strict mode with bundler module resolution",
        tailwind: "CSS-first configuration with native-speed builds",
        shadcn: "The radix-nova style — you own every line",
        router: "Data routers with route-level lazy loading",
        query: "Caching, retries and sync for server state",
        zustand: "Minimal client-side state management",
        motion: "Declarative animation and layout transitions",
        i18next: "Type-safe internationalization",
        vitest: "Unit tests that share your Vite config",
        qiuye: "17 extension components that fit the official theme",
      },
    },
    features: {
      title: "Conventions that just work",
      description:
        "Not a pile of components, but a project skeleton you can build on from day one.",
      items: {
        routing: {
          title: "Route-level code splitting",
          description:
            "React Router data routes with lazy loading, a top progress bar while navigating, and shared error and 404 boundaries.",
        },
        data: {
          title: "Data fetching",
          description:
            "A tiny fetch wrapper paired with TanStack Query for caching, retries and loading states.",
        },
        theme: {
          title: "Theming & dark mode",
          description:
            "Powered by next-themes and CSS variables — no flash on first paint, with a view-transition when switching.",
        },
        i18n: {
          title: "Type-safe i18n",
          description:
            "Keys are inferred from the Chinese source messages, so typos and missing translations fail at compile time.",
        },
        motion: {
          title: "Consistent motion",
          description:
            "All animation runs on Motion and respects the system's reduced-motion preference.",
        },
        quality: {
          title: "Code quality",
          description:
            "ESLint flat config, Prettier with Tailwind class sorting, Vitest and Testing Library.",
        },
      },
    },
    playground: {
      title: "Try it",
      description:
        "The count lives in a Zustand store persisted to localStorage, so it survives a reload. The digit transition is QiuYe UI's AnimatedNumber.",
      label: "Clicks",
      increment: "Increment",
      decrement: "Decrement",
      reset: "Reset",
      resetToast: "Counter reset",
    },
    structure: {
      title: "Project structure",
      description:
        "Folders are organized by responsibility. Adding a page takes two steps: write it, then register the route.",
    },
  },
  components: {
    title: "Components",
    description:
      "Official shadcn/ui primitives and QiuYe UI extensions, rendered under the same theme. Every component can be installed on demand with the shadcn CLI.",
    filter: {
      label: "Component source",
      all: "All",
      shadcn: "shadcn/ui",
      qiuye: "QiuYe UI",
    },
    install: "Install",
    demos: {
      button: {
        title: "Button",
        description:
          "Six variants and several sizes, with icon and asChild support.",
        default: "Default",
        secondary: "Secondary",
        outline: "Outline",
        ghost: "Ghost",
        destructive: "Destructive",
        link: "Link",
      },
      form: {
        title: "Form controls",
        description: "Input, Textarea, Switch and Label working together.",
        name: "Project name",
        namePlaceholder: "my-awesome-app",
        intro: "Description",
        introPlaceholder: "Describe your project in one sentence…",
        notify: "Notify me when the build finishes",
      },
      overlay: {
        title: "Overlays",
        description: "Dialog, Popover, Tooltip and DropdownMenu.",
        dialog: "Dialog",
        dialogTitle: "Publish a new release",
        dialogDescription:
          "Once published, every user gets the update on their next visit.",
        cancel: "Cancel",
        confirm: "Publish",
        popover: "Popover",
        popoverText:
          "Popovers are great for light supplementary info or quick actions.",
        tooltip: "Tooltip",
        tooltipText: "This is a tooltip",
        menu: "Menu",
        menuProfile: "Profile",
        menuSettings: "Settings",
        menuSignOut: "Sign out",
      },
      feedback: {
        title: "Feedback",
        description: "Badge, Skeleton, Spinner and Sonner toasts.",
        toast: "Show toast",
        toastTitle: "Saved",
        toastDescription: "Your changes have been synced to the cloud.",
        loading: "Processing",
      },
      segmentedControl: {
        title: "SegmentedControl",
        description:
          "A ChatGPT-style segmented picker with a spring-animated thumb.",
        day: "Day",
        week: "Week",
        month: "Month",
        year: "Year",
      },
      responsiveTabs: {
        title: "ResponsiveTabs",
        description:
          "Falls back to a scrollable layout with edge fades when space runs out.",
        overview: "Overview",
        analytics: "Analytics",
        reports: "Reports",
        notifications: "Notifications",
        settings: "Settings",
        current: "Current tab: {{label}}",
      },
      clipPathTabs: {
        title: "ClipPathTabs",
        description: "Smoothly swaps background and text color with clip-path.",
        preview: "Preview",
        code: "Code",
        docs: "Docs",
        content: "Content of the “{{label}}” panel",
      },
      dualStateToggle: {
        title: "DualStateToggle",
        description: "Switches between two icons with blur and rotation.",
        play: "Play",
        pause: "Pause",
        mute: "Mute",
        unmute: "Unmute",
      },
      themeToggle: {
        title: "ThemeTransitionToggle",
        description:
          "A circular reveal theme switch built on View Transitions — the same one used in the header.",
        hint: "Click the button to switch theme",
      },
      animatedNumber: {
        title: "AnimatedNumber",
        description:
          "Each digit transitions independently, with Intl formatting.",
        random: "Random amount",
      },
      typewriter: {
        title: "Typewriter",
        description:
          "Looping text that types and deletes character by character.",
        phrases: ["Hello, World", "你好，世界", "Bonjour le monde"],
      },
      colorPicker: {
        title: "ColorPicker",
        description: "Supports alpha, preset swatches and recent colors.",
      },
      smoothCorners: {
        title: "SmoothCorners",
        description:
          "Figma / iOS style superellipse corners that fall back to regular radii.",
        smooth: "Smooth",
        regular: "Regular",
      },
      dotGlass: {
        title: "DotGlass",
        description:
          "A dotted frosted-glass surface for nav bars and overlays.",
      },
      imageViewer: {
        title: "ImageViewer",
        description:
          "Click the image to zoom it seamlessly into a full-screen preview.",
        alt: "A valley at dawn",
      },
      expandableCard: {
        title: "ExpandableCard",
        description:
          "App Store style: grows continuously from its slot into a centered detail sheet.",
        eyebrow: "Featured",
        cardTitle: "Start from a\nclean slate",
        name: "QiuYe React Template",
        subtitle: "Vite · React · shadcn/ui",
        action: "Get",
        open: "View",
        close: "Close",
        body1:
          "This card demonstrates a container transform: it expands from its place in the list into a centered sheet and lands exactly back where it came from when closed.",
        body2:
          "Content inside the sheet scrolls independently without reflowing the page, and on narrow screens you can drag down to dismiss.",
      },
      scrollableDialog: {
        title: "ScrollableDialog",
        description:
          "The header and footer stay put while only the body scrolls.",
        open: "Read the terms",
        dialogTitle: "Terms of Service",
        dialogDescription: "Please read the following terms before continuing.",
        section: "Section {{index}}",
        paragraph:
          "Placeholder text to demonstrate scrolling. The header and footer remain visible and only the body scrolls, so long content never pushes the actions off screen.",
        accept: "I have read and agree",
      },
      tour: {
        title: "Tour",
        description: "Spotlight-style, step-by-step product tours.",
        start: "Start tour",
        step1Title: "Filter components",
        step1Content:
          "Filter by source to see shadcn/ui or QiuYe UI components.",
        step2Title: "Copy install commands",
        step2Content:
          "Every component comes with a ready-to-copy shadcn CLI command.",
        step3Title: "Switch theme",
        step3Content:
          "Every component follows the theme — try it in dark mode.",
      },
      codeBlock: {
        title: "CodeBlock",
        description:
          "Syntax highlighting, line numbers, highlighted lines and copy.",
      },
      markdownRenderer: {
        title: "MarkdownRenderer",
        description:
          "GFM, code blocks, tables and Mermaid diagrams, lazy loaded.",
      },
      matrixEffect: {
        title: "MatrixEffect",
        description:
          "Canvas-based flowing dot matrix that pauses when off screen.",
        label: "A soft, flowing dot matrix",
      },
    },
  },
  about: {
    title: "About",
    description:
      "QiuYe React Template is a React + Vite starting point for real projects: close to official conventions, with the everyday engineering pieces already in place.",
    repo: {
      title: "Repository",
      description:
        "Live GitHub data fetched with TanStack Query, demonstrating loading, error and retry states.",
      stars: "Stars",
      forks: "Forks",
      issues: "Issues",
      updated: "Last updated",
      error: "Couldn't load GitHub data",
      errorHint: "This might be a network issue or the API rate limit.",
    },
    start: {
      title: "Getting started",
      description:
        "After cloning, these steps are usually all you need before writing features.",
      steps: {
        env: {
          title: "Set app info",
          description:
            "Configure the app name, description and API URL in .env.",
        },
        nav: {
          title: "Configure navigation",
          description:
            "Maintain site links and nav items in src/config/site.ts.",
        },
        page: {
          title: "Add pages",
          description:
            "Create pages under src/pages and register lazy routes in src/app/router.tsx.",
        },
        components: {
          title: "Add components on demand",
          description:
            "Add components with the shadcn CLI; delete the demo pages and QiuYe UI components you don't need.",
        },
      },
    },
  },
  notFound: {
    title: "Page not found",
    description:
      "The page you're looking for may have been moved, deleted, or the URL is mistyped.",
  },
  error: {
    title: "Something went wrong",
    description:
      "An unexpected error occurred while rendering this page. Try again or go back home.",
  },
}

export default enUS
