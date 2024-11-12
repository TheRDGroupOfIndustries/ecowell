import CommonBreadcrumb from "@/CommonComponents/CommonBreadcrumb";
import { Fragment, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import GeneralForm from "./GeneralForm";
import MetaDataForm from "./MetaDataForm";
import VariantForm from "./VariantForm";
import AdditionalInfoForm from "./AdditionalForm";
import axios from 'axios';
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

interface Variant {
  flavor: string;
  images: string[];
  stock: number;
  form: "tablet" | "powder" | "liquid";
  netQuantity: string;
  nutritionFacts: string[];
  allergens?: string[];
  servingSize: string;
}

const AddDigitalProduct = () => {
  const router = useRouter();

  // General Form
  const [generalFormState, setGeneralFormState] = useState({
    price: 0,
    salePrice: 0,
    discount: 0,
    directions: [] as string[],
    ingredients: [] as string[],
    benefits: [] as string[],
    faqs: [] as { question: string; answer: string }[],
    title: '',
    description: '',
    category: {
      title: '',
      slug: '',
    },
    brand: '',
    isNew: false,
    bestBefore: '',
  });

  const handleGeneralForm = (field: string, value: any) => {
    setGeneralFormState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  // Variant Form
  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariant, setNewVariant] = useState<Variant>({
    flavor: "",
    images: [],
    stock: 0,
    form: "tablet",
    netQuantity: "",
    nutritionFacts: [],
    allergens: [],
    servingSize: "",
  });
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});
  const [isUploading, setIsUploading] = useState(false);

  const variantFormProps = {
    variants,
    setVariants,
    newVariant,
    setNewVariant,
    imagePreviews,
    setImagePreviews,
    errors,
    setErrors,
    isUploading,
    setIsUploading,
  };

  const [additionalInfoStates, setAdditionalInfoStates] = useState({
    manufacturedBy: '',
    countryOfOrigin: '',
    phone: '',
    email: '',
  });

  const handleAdditionalChange = (field: string, value: any) => {
    setAdditionalInfoStates((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleVariantChange = (name: string, value: any) => {
    setNewVariant({
      ...newVariant,
      [name]: value
    });
  };

  const [isPosting, setIsPosting] = useState(false);

  const handleSave = async () => {
    // Validate required fields
    const requiredFields = [
      'title', 'description', 'category.title', 'category.slug', 'brand', 'price', 'bestBefore'
    ];
    const missingFields = requiredFields.filter(field => {
      const keys = field.split('.');
      let value: any = generalFormState;
      keys.forEach((key: string) => {
        value = value[key as keyof typeof value];
      });
      return !value;
    });

    if (missingFields.length > 0) {
      toast.error("Please fill these required fields: " + missingFields.join(", "));
      return;
    }

    if (variants.length === 0) {
      toast.error("Please add at least one variant.");
      return;
    }
    if (generalFormState.price <= 0 || generalFormState.salePrice <= 0) {
      toast.error("Price and sale price must be greater than 0.");
      return;
    }

    if (generalFormState.price <= generalFormState.salePrice) {
      toast.error("Sale price must be less than the price.");
      return;
    }

    setIsPosting(true);

    const product = {
      ...generalFormState,
      variants: variants,
      additionalInfo: {
        manufacturedBy: additionalInfoStates.manufacturedBy || " ",
        countryOfOrigin: additionalInfoStates.countryOfOrigin || " ",
        phone: additionalInfoStates.phone || " ",
        email: additionalInfoStates.email || " ",
      },
      sku: "some-sku-value", // Add a valid SKU value
      ratings: 0, // Default value
      reviews_number: 0, // Default value
    };

    try {
      const response = await axios.post('/api/products/create/create-single', product);
      console.log(response.data);
      toast.success("Product created successfully");
      // Reset all fields
      setGeneralFormState({
        price: 0,
        salePrice: 0,
        discount: 0,
        directions: [],
        ingredients: [],
        benefits: [],
        faqs: [],
        title: '',
        description: '',
        category: {
          title: '',
          slug: '',
        },
        brand: '',
        isNew: false,
        bestBefore: '',
      });
      setVariants([]);
      setAdditionalInfoStates({
        manufacturedBy: '',
        countryOfOrigin: '',
        phone: '',
        email: '',
      });
      // Redirect to product list
      router.push("/en/products/digital/digital-product-list");
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Failed to create product");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCancel = () => {
    // Reset all fields
    setGeneralFormState({
      price: 0,
      salePrice: 0,
      discount: 0,
      directions: [],
      ingredients: [],
      benefits: [],
      faqs: [],
      title: '',
      description: '',
      category: {
        title: '',
        slug: '',
      },
      brand: '',
      isNew: false,
      bestBefore: '',
    });
    setVariants([]);
    setAdditionalInfoStates({
      manufacturedBy: '',
      countryOfOrigin: '',
      phone: '',
      email: '',
    });
    // Redirect to home page
    router.push("/");
  };

  return (
    <Fragment>
      <CommonBreadcrumb title="Add Products" parent="products/digital" element={
        <div className="d-flex gap-2 justify-content-end ">
          <button onClick={handleSave} className="btn btn-primary" disabled={isPosting}>
            {isPosting ? "Creating..." : "Save"}
          </button>
          <button onClick={handleCancel} className="btn btn-secondary">Cancel</button>
        </div>
      } />
      <Container fluid>
        <Row className="product-adding">
          <Col xl="6">
            <GeneralForm generalFormState={generalFormState} handleGeneralForm={handleGeneralForm} />
          </Col>
          <Col xl="6">
            <VariantForm variantProps={variantFormProps} handleVariantChange={handleVariantChange} />
            <AdditionalInfoForm additionalInfoStates={additionalInfoStates} handleAdditionalChange={handleAdditionalChange} />
            {/* <MetaDataForm /> */}
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default AddDigitalProduct;