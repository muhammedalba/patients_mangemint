import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img 
            src="/zirconLogo.png" 
            alt="Zircon Logo" 
            className={props.className} 
            style={{ objectFit: 'contain' }}
        />
    );
}