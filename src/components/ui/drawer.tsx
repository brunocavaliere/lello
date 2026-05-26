'use client';

import * as React from 'react';
import { Dialog as DialogPrimitive } from 'radix-ui';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@/lib/utils';

type DrawerResponsiveContextValue = {
  isDesktop: boolean;
};

const DrawerResponsiveContext = React.createContext<DrawerResponsiveContextValue>({
  isDesktop: false,
});

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    function handleChange() {
      setIsDesktop(mediaQuery.matches);
    }

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return isDesktop;
}

function useDrawerResponsiveContext() {
  return React.useContext(DrawerResponsiveContext);
}

function Drawer({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  const isDesktop = useIsDesktop();

  return (
    <DrawerResponsiveContext.Provider value={{ isDesktop }}>
      {isDesktop ? (
        <DialogPrimitive.Root data-slot="drawer" {...props} />
      ) : (
        <DrawerPrimitive.Root
          shouldScaleBackground={shouldScaleBackground}
          data-slot="drawer"
          {...props}
        />
      )}
    </DrawerResponsiveContext.Provider>
  );
}

function DrawerTrigger({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  const { isDesktop } = useDrawerResponsiveContext();

  if (isDesktop) {
    return <DialogPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
  }

  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerPortal({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  const { isDesktop } = useDrawerResponsiveContext();

  if (isDesktop) {
    return <DialogPrimitive.Portal data-slot="drawer-portal" {...props} />;
  }

  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;
}

function DrawerClose({ ...props }: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  const { isDesktop } = useDrawerResponsiveContext();

  if (isDesktop) {
    return <DialogPrimitive.Close data-slot="drawer-close" {...props} />;
  }

  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  const { isDesktop } = useDrawerResponsiveContext();

  if (isDesktop) {
    return (
      <DialogPrimitive.Overlay
        data-slot="drawer-overlay"
        className={cn(
          'fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px] transition-opacity data-[state=closed]:opacity-0 data-[state=closed]:duration-300 data-[state=open]:opacity-100 data-[state=open]:duration-500',
          className
        )}
        {...props}
      />
    );
  }

  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn('fixed inset-0 z-50 bg-black/45 backdrop-blur-[2px]', className)}
      {...props}
    />
  );
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  const { isDesktop } = useDrawerResponsiveContext();

  if (isDesktop) {
    return (
      <DrawerPortal>
        <DrawerOverlay />
        <DialogPrimitive.Content
          data-slot="drawer-content"
          className={cn(
            'bg-background border-border/80 fixed top-0 right-0 bottom-0 left-auto z-50 mt-0 flex h-full w-full flex-col border-l shadow-2xl transition-transform ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-[state=closed]:translate-x-full data-[state=closed]:duration-300 data-[state=open]:translate-x-0 data-[state=open]:duration-500 md:max-w-xl',
            className,
            'md:top-0 md:max-h-none md:rounded-none md:rounded-l-[1rem] md:border-t-0'
          )}
          {...(props as React.ComponentProps<typeof DialogPrimitive.Content>)}
        >
          {children}
        </DialogPrimitive.Content>
      </DrawerPortal>
    );
  }

  return (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'bg-background border-border/80 fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[1rem] border shadow-2xl outline-none',
          className
        )}
        {...props}
      >
        <div className="bg-muted mx-auto mt-3 h-1.5 w-12 rounded-full" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn('flex flex-col gap-1.5 px-5 pt-4 pb-2 text-left', className)}
      {...props}
    />
  );
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn('mt-auto flex flex-col gap-2 p-4', className)}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  const { isDesktop } = useDrawerResponsiveContext();

  if (isDesktop) {
    return (
      <DialogPrimitive.Title
        data-slot="drawer-title"
        className={cn('text-foreground font-semibold', className)}
        {...props}
      />
    );
  }

  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn('text-foreground font-semibold', className)}
      {...props}
    />
  );
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  const { isDesktop } = useDrawerResponsiveContext();

  if (isDesktop) {
    return (
      <DialogPrimitive.Description
        data-slot="drawer-description"
        className={cn('text-muted-foreground text-sm', className)}
        {...props}
      />
    );
  }

  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
};
