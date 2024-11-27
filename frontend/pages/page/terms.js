import React from 'react';
import { Link, ShieldCheck, Globe, Users, Lock } from 'lucide-react';
import CommonLayout from '../../components/shop/common-layout';

const TermsAndConditions = () => {
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
                        Terms and Conditions
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
                        Terms and Conditions of Use
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
                        These Terms and Conditions of Use (or "Terms") govern your use of the Ecowell website and services
                        (the "Service"). By accessing or using Ecowell, you agree to comply with these Terms.
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
                        The Ecowell Service
                    </h2>

                    <p style={{ marginBottom: '16px' }}>
                        We are committed to providing a platform dedicated to helping you discover and purchase
                        premium supplements and wellness products. Our Service includes:
                    </p>

                    <ul style={{
                        listStyleType: 'disc',
                        paddingLeft: '24px',
                        marginBottom: '16px'
                    }}>
                        {/* List items remain the same, just update strong text color */}
                        <li style={{ marginBottom: '12px' }}>
                            <strong style={{ color: primaryColor }}>Personalized Wellness Solutions</strong>
                            <p style={{ fontWeight: 'normal', marginTop: '4px' }}>
                                We offer tailored recommendations to help you discover products suited to your
                                individual health and wellness goals.
                            </p>
                        </li>

                        {/* Repeat for other list items, adding color to strong tags */}
                        <li style={{ marginBottom: '12px' }}>
                            <strong style={{ color: primaryColor }}>A Safe and Inclusive Community</strong>
                            <p style={{ fontWeight: 'normal', marginTop: '4px' }}>
                                We aim to create a positive and secure space for all users. This includes using
                                advanced tools and resources to prevent misuse, fraud, or violations of these Terms.
                            </p>
                        </li>

                        {/* Continue with other list items... */}
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
                        Your Commitments
                    </h2>

                    <p style={{ marginBottom: '16px' }}>
                        To ensure a safe and secure environment, users must:
                    </p>

                    <ul style={{
                        listStyleType: 'disc',
                        paddingLeft: '24px',
                        marginBottom: '16px'
                    }}>
                        <li style={{ marginBottom: '8px' }}>
                            Be at least 13 years old or meet the minimum legal age in their country.
                        </li>
                        <li style={{ marginBottom: '8px' }}>
                            Provide accurate and up-to-date information when creating an account.
                        </li>
                        <li>
                            Use the Service lawfully and respectfully, avoiding any fraudulent, misleading,
                            or unauthorized activities.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        </CommonLayout>
    );
};

export default TermsAndConditions;