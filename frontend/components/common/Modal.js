




// import React, { useState, useEffect } from "react";
// import {
//   Col,
//   Media,
//   Row,
//   Modal,
//   ModalBody,
//   Input,
//   Form,
//   Button,
// } from "reactstrap";
// import offerBanner from "../../public/assets/images/Offer-banner.png";
// import { useSession } from "next-auth/react";

// const ModalComponent = () => {
//   const [modal, setModal] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [email, setEmail] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const { data: session } = useSession();
//   const userId = session?.user?._id;
//   console.log(userId)

//   const toggle = () => setModal(!modal);

//   useEffect(() => {
//     const checkSubscription = async () => {
//       if (userId) {
//         try {
//           const response = await fetch(`/api/Newsletter/check?userId=${userId}`);
//           if (response.ok) {
//             const data = await response.json();
//             setIsSubscribed(true);
//           } else if (response.status === 404) {
//             setIsSubscribed(false);
//             // Show modal after 20 seconds if user is not subscribed
//             setTimeout(() => {
//               setModal(true);
//             }, 20000);
//           }
//         } catch (error) {
//           console.error("Error checking subscription:", error);
//         }
//       } else {
//         // Show modal after 20 seconds if user is not signed in
//         const timer = setTimeout(() => {
//           setModal(true);
//         }, 20000);

//         // Cleanup timer if component unmounts
//         return () => clearTimeout(timer);
//       }
//     };

//     checkSubscription();
//   }, [userId]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setSuccessMessage("");

//     if (!userId) {
//       setError("You must be logged in to subscribe");
//       setIsLoading(false);
//       return;
//     }

//     if (!email) {
//       setError("Email is required");
//       setIsLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('/api/Newsletter/push', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           userId,
//           emails: [email]
//         }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setSuccessMessage("Successfully subscribed to the newsletter!");
//         setEmail("");
//         setIsSubscribed(true);
//         setTimeout(() => {
//           toggle();
//         }, 2000); // Close modal after 2 seconds on success
//       } else if (response.status === 409) {
//         setError("You're already subscribed with this email");
//       } else {
//         setError(data.message || "Failed to subscribe");
//       }
//     } catch (error) {
//       setError("An error occurred while subscribing");
//       console.error("Subscription error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Modal
//       isOpen={modal}
//       toggle={toggle}
//       className="theme-modal modal-lg"
//       centered
//     >
//       <div>
//         <ModalBody className="modal1">
//           <Row className="compare-modal">
//             <Col lg="12">
//               <div className="modal-bg">
//                 <Button
//                   type="button"
//                   className="btn-close"
//                   data-dismiss="modal"
//                   aria-label="Close"
//                   onClick={toggle}
//                 ></Button>
//                 <div className="offer-content">
//                   <Media
//                     src={offerBanner.src}
//                     className="img-fluid blur-up lazyload"
//                     alt=""
//                   />
//                   <h2>Newsletter</h2>
//                   {error && (
//                     <div className="alert alert-danger" role="alert">
//                       {error}
//                     </div>
//                   )}
//                   {successMessage && (
//                     <div className="alert alert-success" role="alert">
//                       {successMessage}
//                     </div>
//                   )}
//                   <Form onSubmit={handleSubmit} className="auth-form needs-validation">
//                     <div className="form-group mx-sm-3">
//                       <Input
//                         type="email"
//                         className="form-control"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         placeholder="Enter your email"
//                         required
//                       />
//                       <Button
//                         type="submit"
//                         className="btn btn-solid"
//                         disabled={isLoading}
//                       >
//                         {isLoading ? "Subscribing..." : "Subscribe"}
//                       </Button>
//                     </div>
//                   </Form>
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </ModalBody>
//       </div>
//     </Modal>
//   );
// };

// export default ModalComponent;







import React, { useState, useEffect } from "react";
import {
  Col,
  Media,
  Row,
  Modal,
  ModalBody,
  Input,
  Form,
  Button,
} from "reactstrap";
import offerBanner from "../../public/assets/images/Offer-banner.png";
import { useSession } from "next-auth/react";

const ModalComponent = () => {
  const [modal, setModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { data: session } = useSession();
  const userId = session?.user?._id;

  const toggle = () => setModal(!modal);

  useEffect(() => {
    const checkSubscription = async () => {
      // Check localStorage first
      const subscriptionStatus = localStorage.getItem(`newsletter_subscribed_${userId}`);
      const modalShown = localStorage.getItem(`newsletter_modal_shown_${userId}`);

      if (subscriptionStatus === 'true') {
        setIsSubscribed(true);
        return; // Don't check API if we know user is subscribed
      }

      if (userId) {
        try {
          const response = await fetch(`/api/Newsletter/check?userId=${userId}`);
          if (response.ok) {
            setIsSubscribed(true);
            localStorage.setItem(`newsletter_subscribed_${userId}`, 'true');
          } else if (response.status === 404) {
            setIsSubscribed(false);
            localStorage.setItem(`newsletter_subscribed_${userId}`, 'false');

            // Show modal after 20 seconds if not shown before
            if (!modalShown) {
              setTimeout(() => {
                setModal(true);
                localStorage.setItem(`newsletter_modal_shown_${userId}`, 'true');
              }, 20000);
            }
          }
        } catch (error) {
          console.error("Error checking subscription:", error);
        }
      } else {
        // For non-logged in users, use a generic key
        const genericModalShown = localStorage.getItem('newsletter_modal_shown_guest');

        // Show modal after 20 seconds if not shown before
        if (!genericModalShown) {
          const timer = setTimeout(() => {
            setModal(true);
            localStorage.setItem('newsletter_modal_shown_guest', 'true');
          }, 20000);

          return () => clearTimeout(timer);
        }
      }
    };

    checkSubscription();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (!userId) {
      setError("You must be logged in to subscribe");
      setIsLoading(false);
      return;
    }

    if (!email) {
      setError("Email is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/Newsletter/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          emails: [email]
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Successfully subscribed to the newsletter!");
        setEmail("");
        setIsSubscribed(true);
        // Save subscription status to localStorage
        localStorage.setItem(`newsletter_subscribed_${userId}`, 'true');
        setTimeout(() => {
          toggle();
        }, 2000);
      } else if (response.status === 409) {
        setError("You're already subscribed with this email");
      } else {
        setError(data.message || "Failed to subscribe");
      }
    } catch (error) {
      setError("An error occurred while subscribing");
      console.error("Subscription error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if(isSubscribed){
    return null
  }

  return (
    <Modal
      isOpen={modal}
      toggle={toggle}
      className="theme-modal modal-lg"
      centered
    >
      <div>
        <ModalBody className="modal1">
          <Row className="compare-modal">
            <Col lg="12">
              <div className="modal-bg">
                <Button
                  type="button"
                  className="btn-close"
                  data-dismiss="modal"
                  aria-label="Close"
                  onClick={toggle}
                ></Button>
                <div className="offer-content">
                  <Media
                    src={offerBanner.src}
                    className="img-fluid blur-up lazyload"
                    alt=""
                  />
                  <h2>Newsletter</h2>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}
                  {successMessage && (
                    <div className="alert alert-success" role="alert">
                      {successMessage}
                    </div>
                  )}
                  <Form onSubmit={handleSubmit} className="auth-form needs-validation">
                    <div className="form-group mx-sm-3">
                      <Input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                      <Button
                        type="submit"
                        className="btn btn-solid"
                        disabled={isLoading}
                      >
                        {isLoading ? "Subscribing..." : "Subscribe"}
                      </Button>
                    </div>
                  </Form>
                </div>
              </div>
            </Col>
          </Row>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default ModalComponent;