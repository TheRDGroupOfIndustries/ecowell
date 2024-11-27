import React from 'react';
import { Link, ShieldCheck, Lock } from 'lucide-react';
import CommonLayout from '../../components/shop/common-layout';

const PrivacyPolicy = () => {
    const primaryColor = '#d4a018';
    const backgroundColor = '#F4EDE3';

    return (
        <CommonLayout parent="home" title="About-us">
        <div style={{
            maxWidth: '100%',
            width: '100%',
            minHeight: '100vh',
            padding: '24px',
            backgroundColor: backgroundColor,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <div style={{ color: primaryColor, marginBottom: '8px' }}>
                    <a href="#" style={{ color: primaryColor, textDecoration: 'none' }}>
                        Privacy Policy
                    </a>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                }}>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: primaryColor
                    }}>
                        Privacy Policy of Ecowell
                    </h1>
                    <a
                        href="#"
                        style={{
                            color: primaryColor,
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        <Link
                            size={16}
                            style={{
                                marginRight: '4px',
                                color: primaryColor
                            }}
                        />
                        Copy link
                    </a>
                </div>

                <div
                    style={{
                        backgroundColor: 'rgba(212, 160, 24, 0.1)',
                        padding: '16px',
                        borderRadius: '8px',
                        marginBottom: '24px',
                        border: `1px solid ${primaryColor}`
                    }}
                >
                    <p style={{ color: primaryColor }}>
                        <strong>Effective Date:</strong> January 1, 2025
                    </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <p>Welcome to Ecowell!</p>

                    <p style={{ marginTop: '16px' }}>
                        At Ecowell, we respect your privacy and are committed to protecting your personal data. This Privacy Policy
                        explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                    </p>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        color: primaryColor
                    }}>
                        <ShieldCheck size={24} style={{ marginRight: '8px', color: primaryColor }} />
                        Information We Collect
                    </h2>

                    <ul style={{
                        listStyleType: 'disc',
                        paddingLeft: '24px',
                        marginBottom: '16px'
                    }}>
                        <li style={{ marginBottom: '12px' }}>
                            <strong style={{ color: primaryColor }}>Personal Information:</strong>
                            Includes name, email, phone number, address, and payment details.
                        </li>
                        <li style={{ marginBottom: '12px' }}>
                            <strong style={{ color: primaryColor }}>Non-Personal Information:</strong>
                            Such as browser type, IP address, and pages visited on our website.
                        </li>
                    </ul>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        color: primaryColor
                    }}>
                        <Lock size={24} style={{ marginRight: '8px', color: primaryColor }} />
                        How We Use Your Information
                    </h2>

                    <p style={{ marginBottom: '16px' }}>
                        The information we collect is used to:
                    </p>

                    <ul style={{
                        listStyleType: 'disc',
                        paddingLeft: '24px',
                        marginBottom: '16px'
                    }}>
                        <li style={{ marginBottom: '8px' }}>
                            Process orders and deliver products.
                        </li>
                        <li style={{ marginBottom: '8px' }}>
                            Send promotional emails with your consent.
                        </li>
                        <li style={{ marginBottom: '8px' }}>
                            Improve our services and user experience.
                        </li>
                    </ul>
                </div>

                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{
                        fontSize: '20px',
                        fontWeight: 'bold',
                        marginBottom: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        color: primaryColor
                    }}>
                        <ShieldCheck size={24} style={{ marginRight: '8px', color: primaryColor }} />
                        Your Privacy Rights
                    </h2>

                    <p style={{ marginBottom: '16px' }}>
                        Depending on your location, you may have the right to:
                    </p>

                    <ul style={{
                        listStyleType: 'disc',
                        paddingLeft: '24px',
                        marginBottom: '16px'
                    }}>
                        <li style={{ marginBottom: '8px' }}>
                            Access, update, or delete your personal data.
                        </li>
                        <li style={{ marginBottom: '8px' }}>
                            Opt out of promotional communications.
                        </li>
                        <li style={{ marginBottom: '8px' }}>
                            Restrict the processing of your data.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </CommonLayout>
    );
};

export default PrivacyPolicy;
