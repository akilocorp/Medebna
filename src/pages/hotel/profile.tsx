import React, { useState } from "react";
import { Field, reduxForm, FieldArray, InjectedFormProps } from 'redux-form';
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { addHotelOwnerProfile } from "@/stores/operator/hotelprofileapicaller";
import OperatorLayout from "@/components/operator/operatorLayout";
import { CldUploadWidget } from "next-cloudinary";
import { RiUploadCloudFill } from "react-icons/ri";

interface Facilities {
  popularFacilities: string[];
  roomAmenities: string[];
  outdoorFacilities: string[];
  kitchenFacilities: string[];
  mediaTech: string[];
  foodDrink: string[];
  transportFacilities: string[];
  receptionServices: string[];
  cleaningServices: string[];
  businessFacilities: string[];
  safetyFacilities: string[];
  generalFacilities: string[];
  accessibility: string[];
  wellnessFacilities: string[];
  languages: string[];
}

interface CheckInOut {
  time: string;
  description: string;
}

interface HouseRules {
  checkIn: CheckInOut;
  checkOut: CheckInOut;
  cancellationPrepayment: string;
  childrenAndBeds: string;
  cribsAndExtraBedPolicies: string;
  noAgeRestriction: string;
  pets: string;
  acceptedPaymentMethods: string;
}

interface HotelProfileBase {
  address: string;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  rating: number;
  facilities: Facilities;
  houseRules: HouseRules;
  createdBy: string;
}

interface HotelProfile extends HotelProfileBase {
  _id: string;
}

interface HotelProfileCreate extends HotelProfileBase {}

interface FormValues {
  address: string;
  zipCode: string;
  city: string;
  companyImage: string;
  description: string;
  rating: number;
  facilities: Partial<Facilities>;
  houseRules: Partial<HouseRules>;
}

const renderField = ({
  input,
  label,
  type,
  meta: { touched, error },
}: {
  input: any;
  label: string;
  type: string;
  meta: { touched: boolean; error?: string };
}) => (
  <div className="mb-6">
    <label className="block text-[#fccc52] mb-2 text-lg font-bold">{label}</label>
    <div className="relative">
      <input
        {...input}
        type={type}
        className="w-full p-3 rounded-full bg-[#ffffff] text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#fccc52] focus:border-transparent shadow-md"
        placeholder={label}
      />
      {touched && error && (
        <span className="text-red-500 text-sm mt-1 block">{error}</span>
      )}
    </div>
  </div>
);

const RenderImageUpload = ({
  input: { value, onChange },
  label,
  widgetParams,
  meta: { touched, error },
}: {
  input: any;
  label: string;
  widgetParams: any;
  meta: { touched: boolean; error?: string };
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(value);

  const handleUpload = (result: any) => {
    if (result.event === "success") {
      const imageUrl = result.info.secure_url;
      onChange(imageUrl);
      setImageUrl(imageUrl);
    }
  };

  return (
    <div className="relative mb-4">
      <label className="block text-[#fccc52] mb-2 text-lg font-bold">
        {label}
      </label>
      <CldUploadWidget
        uploadPreset={widgetParams.uploadPreset}
        onSuccess={handleUpload}
      >
        {({ open }) => (
          <button
            type="button"
            className="block w-40 p-2 py-2 rounded border text-black border-[#ff914d] cursor-pointer flex items-center justify-center bg-[#ffffff] hover:bg-[#fccc52]"
            onClick={() => open()}
          >
            <RiUploadCloudFill className="mr-2 text-lg" />
            {imageUrl ? "Change Image" : "Upload Image"}
          </button>
        )}
      </CldUploadWidget>
      {imageUrl && (
        <div className="mt-4">
          <img src={imageUrl} alt="Preview" className="w-32 h-32 rounded" />
        </div>
      )}
      {touched && error && (
        <span className="text-red-500 text-xs absolute -bottom-4 left-0 right-0">
          {error}
        </span>
      )}
    </div>
  );
};

const renderFacilityFields = ({ fields, label }: { fields: any; label: string }) => (
  <div>
    {fields.map((facility: any, index: number) => (
      <div key={index} className="mb-6 p-4 rounded-lg">
        <Field
          name={facility}
          type="text"
          component={renderField}
          label={`${label} Facility`}
          placeholder="Comma separated values"
        />
        <button
          type="button"
          onClick={() => fields.remove(index)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md"
        >
          Remove {label} Facility
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => fields.push('')}
      className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-6 rounded-full font-bold text-lg shadow-md"
    >
      Add {label} Facility
    </button>
  </div>
);

const renderHouseRules = ({ fields, label }: { fields: any; label: string }) => (
  <div>
    {fields.map((rule: any, index: number) => (
      <div key={index} className="mb-6 p-4 rounded-lg">
        <Field
          name={`${rule}.time`}
          type="text"
          component={renderField}
          label={`${label} Time`}
        />
        <Field
          name={`${rule}.description`}
          type="text"
          component={renderField}
          label={`${label} Description`}
        />
        <button
          type="button"
          onClick={() => fields.remove(index)}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md"
        >
          Remove {label} Rule
        </button>
      </div>
    ))}
    <button
      type="button"
      onClick={() => fields.push({ time: '', description: '' })}
      className="bg-[#fccc52] text-[#323232] px-6 py-2 mt-6 rounded-full font-bold text-lg shadow-md"
    >
      Add {label} Rule
    </button>
  </div>
);

const HotelProfileForm: React.FC<InjectedFormProps<FormValues>> = ({
  handleSubmit,
}) => {
  const router = useRouter();

  const onSubmit = async (values: FormValues) => {
    console.log("Submitting values:", values);
    try {
      const formattedValues: HotelProfileCreate = {
        address: values.address,
        zipCode: values.zipCode,
        city: values.city,
        companyImage: values.companyImage,
        description: values.description,
        rating: values.rating,
        facilities: {
          popularFacilities: values.facilities.popularFacilities || [],
          roomAmenities: values.facilities.roomAmenities || [],
          outdoorFacilities: values.facilities.outdoorFacilities || [],
          kitchenFacilities: values.facilities.kitchenFacilities || [],
          mediaTech: values.facilities.mediaTech || [],
          foodDrink: values.facilities.foodDrink || [],
          transportFacilities: values.facilities.transportFacilities || [],
          receptionServices: values.facilities.receptionServices || [],
          cleaningServices: values.facilities.cleaningServices || [],
          businessFacilities: values.facilities.businessFacilities || [],
          safetyFacilities: values.facilities.safetyFacilities || [],
          generalFacilities: values.facilities.generalFacilities || [],
          accessibility: values.facilities.accessibility || [],
          wellnessFacilities: values.facilities.wellnessFacilities || [],
          languages: values.facilities.languages || []
        },
        houseRules: {
          checkIn: {
            time: values.houseRules.checkIn?.time || "Default Check-In Time",
            description: values.houseRules.checkIn?.description || "Default Check-In Description",
          },
          checkOut: {
            time: values.houseRules.checkOut?.time || "Default Check-Out Time",
            description: values.houseRules.checkOut?.description || "Default Check-Out Description",
          },
          cancellationPrepayment: values.houseRules.cancellationPrepayment || '',
          childrenAndBeds: values.houseRules.childrenAndBeds || '',
          cribsAndExtraBedPolicies: values.houseRules.cribsAndExtraBedPolicies || '',
          noAgeRestriction: values.houseRules.noAgeRestriction || '',
          pets: values.houseRules.pets || '',
          acceptedPaymentMethods: values.houseRules.acceptedPaymentMethods || '',
        },
        createdBy: '', 
      };
      
      const createdProfile = await addHotelOwnerProfile(formattedValues);
      
      console.log("Created Profile Response:", createdProfile);
      
      toast.success("Hotel profile added successfully");
  
      if (createdProfile && createdProfile._id) {
        router.push({
          pathname: '/hotel/myprofile',
          query: { id: createdProfile._id },
        });
      } else {
        toast.error("Error fetching profile ID");
      }
    } catch (error) {
      toast.error("Error adding profile");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-4xl mx-auto p-8 bg-[#ffffff] rounded-lg shadow-lg overflow-y-scroll max-h-[42rem]"
    >
      <h2 className="text-2xl font-bold mb-6 text-[#ff914d]">Add Hotel Owner Profile</h2>
      <Field name="address" type="text" component={renderField} label="Address" />
      <Field name="zipCode" type="text" component={renderField} label="Zip Code" />
      <Field name="city" type="text" component={renderField} label="City" />
      <Field
        name="companyImage"
        component={RenderImageUpload}
        label="Company Image URL"
        widgetParams={{ uploadPreset: "u06vgrf1" }}
      />
      <Field name="description" type="textarea" component={renderField} label="Description" />
      <Field name="rating" type="number" component={renderField} label="Rating" />

      <h3 className="text-xl font-semibold mb-4 mt-8 text-[#ff914d]">Facilities</h3>
      <FieldArray name="facilities.popularFacilities" label="Popular" component={renderFacilityFields} />
      <FieldArray name="facilities.roomAmenities" label="Room Amenities" component={renderFacilityFields} />
      <FieldArray name="facilities.outdoorFacilities" label="Outdoor" component={renderFacilityFields} />
      <FieldArray name="facilities.kitchenFacilities" label="Kitchen" component={renderFacilityFields} />
      <FieldArray name="facilities.mediaTech" label="Media & Tech" component={renderFacilityFields} />
      <FieldArray name="facilities.foodDrink" label="Food & Drink" component={renderFacilityFields} />
      <FieldArray name="facilities.transportFacilities" label="Transport" component={renderFacilityFields} />
      <FieldArray name="facilities.receptionServices" label="Reception Services" component={renderFacilityFields} />
      <FieldArray name="facilities.cleaningServices" label="Cleaning Services" component={renderFacilityFields} />
      <FieldArray name="facilities.businessFacilities" label="Business Facilities" component={renderFacilityFields} />
      <FieldArray name="facilities.safetyFacilities" label="Safety Facilities" component={renderFacilityFields} />
      <FieldArray name="facilities.generalFacilities" label="General Facilities" component={renderFacilityFields} />
      <FieldArray name="facilities.accessibility" label="Accessibility" component={renderFacilityFields} />
      <FieldArray name="facilities.wellnessFacilities" label="Wellness Facilities" component={renderFacilityFields} />
      <FieldArray name="facilities.languages" label="Languages" component={renderFacilityFields} />

      <h3 className="text-xl font-semibold mb-4 mt-8 text-[#ff914d]">House Rules</h3>
      <Field
        name="houseRules.checkIn.time"
        type="text"
        component={renderField}
        label="Check-In Time"
      />
      <Field
        name="houseRules.checkIn.description"
        type="text"
        component={renderField}
        label="Check-In Description"
      />
      <Field
        name="houseRules.checkOut.time"
        type="text"
        component={renderField}
        label="Check-Out Time"
      />
      <Field
        name="houseRules.checkOut.description"
        type="text"
        component={renderField}
        label="Check-Out Description"
      />
      <Field name="houseRules.cancellationPrepayment" type="text" component={renderField} label="Cancellation/Prepayment" />
      <Field name="houseRules.childrenAndBeds" type="text" component={renderField} label="Children and Beds" />
      <Field name="houseRules.cribsAndExtraBedPolicies" type="text" component={renderField} label="Cribs and Extra Bed Policies" />
      <Field name="houseRules.noAgeRestriction" type="text" component={renderField} label="No Age Restriction" />
      <Field name="houseRules.pets" type="text" component={renderField} label="Pets" />
      <Field name="houseRules.acceptedPaymentMethods" type="text" component={renderField} label="Accepted Payment Methods" />

      <div className="mt-8 flex items-center justify-center">
        <button
          type="submit"
          className="bg-[#ff914d] text-white py-2 px-4 rounded-md shadow-sm hover:bg-[#fccc52] focus:outline-none focus:ring-2 focus:ring-[#ff914d] focus:ring-offset-2"
        >
          Add Profile
        </button>
      </div>
    </form>
  );
};

const ConnectedHotelProfileForm = reduxForm<FormValues>({
  form: "hotelProfileForm",
})(HotelProfileForm);

const AddHotelOwnerProfilePage: React.FC = () => (
  <OperatorLayout>
    <ConnectedHotelProfileForm />
  </OperatorLayout>
);

export default AddHotelOwnerProfilePage;
