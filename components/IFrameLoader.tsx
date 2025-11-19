'use client'
import React, { useState } from 'react';

const IframeLoader = ({ src, title, ...props }: { src: string, title: string }) => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div style={{ position: 'relative', width: '100%', height: '500px' }}>
            {isLoading && (
                <div
                    className='animate-pulse bg-black/50'
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        border: '1px solid #ccc',
                    }}
                >
                    <p className='text-white'>Loading Iframe content...</p>
                </div>
            )}
            <iframe
                src={src}
                title={title}
                onLoad={() => setIsLoading(false)}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                    opacity: isLoading ? 0 : 1,
                    transition: 'opacity 0.5s ease-in-out',
                }}
                {...props}
            />
        </div>
    );
};

export default IframeLoader;
