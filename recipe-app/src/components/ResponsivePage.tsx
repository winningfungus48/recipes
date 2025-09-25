import React from 'react'

interface ResponsivePageProps {
  children: React.ReactNode
  className?: string
}

const ResponsivePage: React.FC<ResponsivePageProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`responsive-page ${className}`}>
      {children}
      
      <style jsx>{`
        .responsive-page {
          /* Mobile type scale and spacing */
          @media (max-width: 768px) {
            /* Ensure 48px tap targets */
            button, 
            [role="button"], 
            input[type="button"], 
            input[type="submit"] {
              min-height: 48px;
              min-width: 48px;
            }
            
            /* Mobile-optimized spacing */
            .responsive-page h1 {
              font-size: 1.5rem;
              line-height: 1.25;
              margin-bottom: 0.75rem;
            }
            
            .responsive-page h2 {
              font-size: 1.25rem;
              line-height: 1.3;
              margin-bottom: 0.5rem;
            }
            
            .responsive-page h3 {
              font-size: 1.125rem;
              line-height: 1.35;
              margin-bottom: 0.5rem;
            }
            
            /* Compact spacing for mobile */
            .responsive-page .space-y-4 > * + * {
              margin-top: 0.75rem;
            }
            
            .responsive-page .space-y-6 > * + * {
              margin-top: 1rem;
            }
            
            .responsive-page .space-y-8 > * + * {
              margin-top: 1.25rem;
            }
            
            /* Mobile padding adjustments */
            .responsive-page .px-4 {
              padding-left: 1rem;
              padding-right: 1rem;
            }
            
            .responsive-page .py-8 {
              padding-top: 1.5rem;
              padding-bottom: 1.5rem;
            }
          }
        }
      `}</style>
    </div>
  )
}

export default ResponsivePage
