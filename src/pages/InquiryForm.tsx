import React, { useEffect, useState } from 'react';
import { Grid, TextField, Button, Typography, Box, MenuItem, TableCell, TableBody, TableRow, TableHead, Table, DialogActions, DialogContent, DialogTitle, Dialog, Card, CardContent, Autocomplete, FormControl, InputLabel, Select, Checkbox, ListItemText, createFilterOptions, TableContainer, } from '@mui/material';
import { Edit, Delete, NewLabel } from '@mui/icons-material';
import api from '../context/AxiosContext';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


export interface MotorMapping {
    id: number
    inquiryId: number
    motorType: string;
    kw: string;
    hp: string;
    phase: string;
    pole: string;
    frameSize: string;
    dop: string;
    insulationClass: string;
    efficiency: string;
    voltage: string;
    frequency: string;
    quantity: string;
    mounting: string;
    safeAreaHazardousArea: string;
    brand: string;
    ifHazardousArea: string;
    tempClass: string;
    gasGroup: string;
    zone: string;
    hardadousDescription: string
    duty: string
    startsPerHour: string
    cdf: string
    ambientTemp: string
    tempRise: string
    accessories: string[]
    brake: string
    encoderMounting: string
    encoderMountingIfYes: string
    application: string
    segment: string
    narration: string;
    amount: string;
}

interface InquiryFormData {
    inquiryId: number;
    customerType: string;
    customerName: string;
    customerId: number;
    region: string;
    city: string;
    enquiryNo: string;
    enquiryDate: Date;
    rfqNo: string;
    rfqDate: Date;
    stdPaymentTerms: string;
    stdIncoTerms: string;
    listPrice: number;
    discount: number;
    netPriceWithoutGST: number;
    totalPackage: number;
    status: string;
    createdOn: Date;
    createdBy: string;
    updatedOn: Date;
    updatedBy: string;
    email: string;
    phoneNo: string;
    address: string;
    techicalDetailsMapping: MotorMapping[];
    uploadedFiles: uploadedFiles[];
}
enum ListOfValueType {
    Brand = 'brand',
    Frequency = 'frequency',
    Voltage = 'voltage',
    StartsPerHour = 'startsPerHour',
    AmbientTemp = 'ambientTemp',
    Accessories = 'accessories',
    Application = 'application',
    Segment = 'segment',
    StdPaymentTerms = 'stdPaymentTerms',
    City = 'city'
}

type uploadedFiles = {
    attachmentId: number;
    fileObject: File;
    originalFileName: string;
};

const InquiryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [selectedCustOption, setSelectedCustOption] = useState<{ label: string; value: number, inputValue?: string } | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [motorMappingData, setMotorMappingData] = useState<MotorMapping | null>(null);
    const [brandMappings, setBrandMappings] = useState<MotorMapping[]>([]);
    const [editIndex, setEditIndex] = useState(null);
    const [customers, setCustomers] = useState<{ label: string; value: number, inputValue?: string, email: string, phoneNo: string, address: string }[]>([]);
    // State hooks for each type
    const [listOfValues, setListOfValues] = useState<{ id: string; value: string, type: string }[]>([]);
    const [frequencies, setFrequencies] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const [voltages, setVoltages] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const [startsPerHour, setStartsPerHour] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const [brands, setBrands] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const [ambientTemps, setAmbientTemps] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const [accessories, setAccessories] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const [applications, setApplications] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const [segments, setSegments] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const [stdPaymentTerms, setStdPaymentTerms] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const [citys, setcitys] = useState<{ label: string; value: number, inputValue?: string }[]>([]);
    const filter = createFilterOptions();

    const [open, setOpen] = useState(false);
    const [dialogValue, setDialogValue] = useState({
        customerName: '',
        email: '',
        address: '',
        phoneNo: '',
    });
    const [brandInput, setBrandInput] = useState<MotorMapping>({
        id: 0,
        inquiryId: 0,
        motorType: "LT",
        kw: "",
        hp: "",
        phase: "Three",
        pole: "4",
        frameSize: "",
        dop: "IP55",
        insulationClass: "F",
        efficiency: "IE2",
        voltage: "415",
        frequency: "50",
        quantity: "",
        mounting: "B3",
        safeAreaHazardousArea: "Safe Area",
        brand: "",
        ifHazardousArea: "",
        tempClass: "T3",
        gasGroup: "IIA IIB",
        zone: "I",
        hardadousDescription: "",
        duty: "S1",
        startsPerHour: "",
        cdf: "",
        ambientTemp: "50",
        tempRise: "Limited to Class F",
        accessories: [],
        brake: "",
        encoderMounting: "",
        encoderMountingIfYes: "",
        application: "",
        segment: "",
        narration: "",
        amount: "",
    });

    const [formData, setFormData] = useState<InquiryFormData>({
        inquiryId: 0,
        customerType: '',
        customerName: '',
        customerId: 0,
        region: '',
        city: '',
        enquiryNo: '',
        enquiryDate: new Date(),
        rfqNo: '',
        rfqDate: new Date(),
        stdPaymentTerms: '',
        stdIncoTerms: '',
        listPrice: 0,
        discount: 0,
        netPriceWithoutGST: 0,
        totalPackage: 0,
        status: 'Draft',
        createdOn: new Date(),
        createdBy: '',
        updatedOn: new Date(),
        updatedBy: '',
        email: '',
        phoneNo: '',
        address: '',
        techicalDetailsMapping: [],
        uploadedFiles: [], // ✅ no error now
    });

    const [formDataAll, setFormDataAll] = useState<InquiryFormData>({
        inquiryId: 0,
        customerType: '',
        customerName: '',
        customerId: 0,
        region: '',
        city: '',
        enquiryNo: '',
        enquiryDate: new Date(),
        rfqNo: '',
        rfqDate: new Date(),
        stdPaymentTerms: '',
        stdIncoTerms: '',
        listPrice: 0,
        discount: 0,
        netPriceWithoutGST: 0,
        totalPackage: 0,
        status: 'Draft',
        createdOn: new Date(),
        createdBy: '',
        updatedOn: new Date(),
        updatedBy: '',
        email: '',
        phoneNo: '',
        address: '',
        techicalDetailsMapping: [],
        uploadedFiles: [], // ✅ no error now
    });
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [deleteIndex, setDeleteIndex] = useState(null);

    const customerTypeOptions = ['Domestic', 'Export'];
    // Define the motor type options
    const motorTypeOptions = ['LT', 'HT'];
    const regionOptions = ['North', 'South', 'East', 'West'];
    const statusOptions = ['Draft', 'Offer Sent', 'Approved', 'Closed'];
    const phaseOptions = ['Single', 'Three'];
    const poleOptions = ['2', '4', '6', '8', '10', '12', '14', '16', '2/4', '4/8', '2/12', '4/12'];
    const frameSizeOptions = [
        '56', '63', '71', '80', '90S', '90L', '100L', '112M', '132S', '132M',
        '160M', '160L', '180M', '180L', '200L', '225S', '225M', '250M',
        '280S', '280M', '315S', '315M', '315L', '400', '450', '500', '560', '630', '710'
    ];
    const dopOptions = ['IP23', 'IP55', 'IP56', 'IP65', 'IP66', 'IP67'];
    const insulationClassOptions = ['F', 'H'];
    const efficiencyOptions = ['IE1', 'IE2', 'IE3', 'IE4', 'IE5'];
    const mountingOptions = ['B3', 'B5', 'B35', 'V1', 'B34', 'B14', 'V18', 'B6', 'V6'];
    const safeAreaOptions = ['Safe Area', 'Hazardous Area'];
    const zoneOptions = ['I', 'II', '22', '21'];
    const gasGroupOptions = ['I', 'IIA IIB', 'IIC'];
    const tempClassOptions = ['T3', 'T4', 'T5', 'T6'];
    const dutyOptions = ['S1', 'S2-15min', 'S2-30min', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];
    const cdfOptions = ['25%', '40%', '60%', '100%'];
    const tempRiseOptions = ['Limited to Class B', 'Limited to Class F'];
    const tempRiseOptionsH = ['Limited to Class B', 'Limited to Class F', 'Limited to Class H'];
    const yesNoOptions = ['Yes', 'No'];
    const encoderScopeOptions = ['Customer Scope', 'Manufacturer Scope'];

    useEffect(() => {
        fetchCustomers();
        fetchListOfValues();
        if (id) {
            api.get(`Inquiry/${id}`).then(res => {
                console.log(res)
                setFormData(res.data)
                setFormDataAll(res.data)
            });
        }
    }, [id]);

    // useEffect(() => {
    //     fetchCustomers();
    //     fetchListOfValues();
    //     const fetchInquiry = async () => {
    //         try {
    //             const res = await api.get(`Inquiry/${id}`);
    //             console.log(res);
    //             setFormData(res.data);
    //         } catch (error) {
    //             console.error("Failed to fetch inquiry:", error);
    //             // Optionally show a user-friendly error message here
    //         }
    //     };
    //     fetchInquiry();
    // }, [id]);


    const fetchCustomers = async () => {
        try {
            const response = await api.get('Customer'); // Replace with your API URL
            const customerOptions = response.data.map((cust: any) => ({
                label: cust.customerName,   // adjust fields based on API response
                value: +cust.id,
                email: cust.email,
                phoneNo: cust.phoneNo,
                address: cust.address
            }));
            setCustomers(customerOptions);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    // Fetch data function for all types
    const fetchListOfValues = async () => {
        try {
            const response = await api.get('ListOfValues'); // Replace with your API URL
            //Set all list
            setListOfValues(response.data);
            // Mapping for each type

            const brandOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.Brand)
                .map((freq: any) => ({
                    label: freq.value, // Adjust the field name accordingly
                    value: freq.id,
                }));
            setBrands(brandOptions);


            const frequencyOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.Frequency)
                .map((freq: any) => ({
                    label: freq.value, // Adjust the field name accordingly
                    value: freq.id,
                }));
            setFrequencies(frequencyOptions);

            const voltageOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.Voltage)
                .map((voltage: any) => ({
                    label: voltage.value,
                    value: voltage.id,
                }));
            setVoltages(voltageOptions);

            const startsPerHourOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.StartsPerHour)
                .map((sp: any) => ({
                    label: sp.value,
                    value: sp.id,
                }));
            setStartsPerHour(startsPerHourOptions);

            const ambientTempOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.AmbientTemp)
                .map((ambientTemp: any) => ({
                    label: ambientTemp.value,
                    value: ambientTemp.id,
                }));
            setAmbientTemps(ambientTempOptions);

            const accessoriesOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.Accessories)
                .map((accessory: any) => ({
                    label: accessory.value,
                    value: accessory.id,
                }));
            setAccessories(accessoriesOptions);

            const applicationOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.Application)
                .map((application: any) => ({
                    label: application.value,
                    value: application.id,
                }));
            setApplications(applicationOptions);

            const segmentOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.Segment)
                .map((segment: any) => ({
                    label: segment.value,
                    value: segment.id,
                }));
            setSegments(segmentOptions);

            const stdPaymentTermsOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.StdPaymentTerms)
                .map((paymentTerm: any) => ({
                    label: paymentTerm.value,
                    value: paymentTerm.id,
                }));
            setStdPaymentTerms(stdPaymentTermsOptions);

            const citysOptions = response.data
                .filter((x: any) => x.type === ListOfValueType.City)
                .map((city: any) => ({
                    label: city.value,
                    value: city.id,
                }));
            setcitys(citysOptions);

        } catch (error) {
            console.error('Error fetching list of values:', error);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleBrandChange = (e: any) => {
        const { name, value } = e.target;
        // Ensure the value only has up to two decimal places




        if (name === 'kw') {
            const formattedValue = value
                .replace(/[^\d.]/g, '') // Allow only digits and decimal point
                .replace(/^(\d+(\.\d{0,2})?).*$/, '$1'); // Format to two decimal places
            setBrandInput({
                ...brandInput,
                [name]: formattedValue,
            });
        }
        else if (name === 'hp') {
            const formattedValue = value
                .replace(/[^\d.]/g, '') // Allow only digits and decimal point
                .replace(/^(\d+(\.\d{0,2})?).*$/, '$1'); // Format to two decimal places
            setBrandInput({
                ...brandInput,
                [name]: formattedValue,
            });
        }
        else {
            setBrandInput((prev) => {
                if (name === 'safeAreaHazardousArea' && value !== 'Hazardous Area') {
                    // Clear zone and gas group if not hazardous
                    return { ...prev, [name]: value, zone: '', gasGroup: '' };
                }

                if (name === 'encoderMountingIfYes' && value !== 'Yes') {
                    // Clear zone and gas group if not hazardous
                    return { ...prev, [name]: value, zone: '', gasGroup: '' };
                }

                return { ...prev, [name]: value };
            });
        }


    };

    const addBrand = () => {
        if (!brandInput.brand) {
            toast.error('Enter Brand Name.');
            return; // Don't add if brand is empty
        }

        if (editIndex !== null) {

            // If editIndex is not null, update the existing row
            setFormData((prevData: any) => {
                const updatedBrandMapping = [...prevData.techicalDetailsMapping];
                updatedBrandMapping[editIndex] = { ...brandInput }; // Update the specific row
                const totalPackages = updatedBrandMapping.reduce(
                    (sum, item) => sum + (Number(item.quantity) * Number(item.ammount || item.amount || 0)),
                    0
                );
                return {
                    ...prevData,
                    techicalDetailsMapping: updatedBrandMapping,
                    totalPackage: totalPackages
                };
            });
            setEditIndex(null); // Reset edit index after updating
        } else {
            // If editIndex is null, add a new row
            setFormData((prevData: any) => {
                const updatedBrandMapping = [...prevData.techicalDetailsMapping, { ...brandInput }];

                const totalPackages = updatedBrandMapping.reduce(
                    (sum, item) => sum + (Number(item.quantity) * Number(item.ammount || item.amount || 0)),
                    0
                );

                return {
                    ...prevData,
                    techicalDetailsMapping: updatedBrandMapping,
                    totalPackage: totalPackages
                };
            });
        }

        // Reset the brandInput form after adding or updating
        setBrandInput({
            id: 0,
            inquiryId: 0,
            motorType: "LT",
            kw: "",
            hp: "",
            phase: "Three",
            pole: "4",
            frameSize: "",
            dop: "IP55",
            insulationClass: "F",
            efficiency: "IE2",
            voltage: "415",
            frequency: "50",
            quantity: "",
            mounting: "B3",
            safeAreaHazardousArea: "Safe Area",
            brand: "",
            ifHazardousArea: "",
            tempClass: "T3",
            gasGroup: "IIA IIB",
            zone: "I",
            hardadousDescription: "",
            duty: "S1",
            startsPerHour: "",
            cdf: "",
            ambientTemp: "50",
            tempRise: "Limited to Class F",
            accessories: [],
            brake: "",
            encoderMounting: "",
            encoderMountingIfYes: "",
            application: "",
            segment: "",
            narration: "",
            amount: "",
        });
        setOpenModal(false);
    };

    const handleOpenModal = () => {
        setMotorMappingData({
            id: 0,
            inquiryId: 0,
            motorType: "LT",
            kw: "",
            hp: "",
            phase: "Three",
            pole: "4",
            frameSize: "",
            dop: "IP55",
            insulationClass: "F",
            efficiency: "IE2",
            voltage: "415",
            frequency: "50",
            quantity: "",
            mounting: "B3",
            safeAreaHazardousArea: "Safe Area",
            brand: "",
            ifHazardousArea: "",
            tempClass: "T3",
            gasGroup: "IIA IIB",
            zone: "I",
            hardadousDescription: "",
            duty: "S1",
            startsPerHour: "",
            cdf: "",
            ambientTemp: "50",
            tempRise: "Limited to Class F",
            accessories: [],
            brake: "",
            encoderMounting: "",
            encoderMountingIfYes: "",
            application: "",
            segment: "",
            narration: "",
            amount: "",
        });
        setOpenModal(true);
    };

    // const handleEditBrand = (index: any) => {
    //     setBrandInput(formData.techicalDetailsMapping[index]);
    //     setEditIndex(index); // Set the index of the row being edited
    // };

    const handleEditBrand = (index: any) => {
        const selected = formData.techicalDetailsMapping[index];
        setBrandInput({ ...selected }); // pre-fill modal form
        setEditIndex(index);            // track edit mode
        setOpenModal(true);
    };

    const handleDeleteDialogOpen = (index: any) => {
        setDeleteIndex(index);
        setOpenDeleteDialog(true);
    };

    const handleDeleteBrand = () => {
        setFormData((prev) => ({
            ...prev,
            techicalDetailsMapping: prev.techicalDetailsMapping.filter((_, i) => i !== deleteIndex),
        }));
        setOpenDeleteDialog(false);
    };

    const handleSubmit = async () => {
        console.log('Submitted:', formData);
        if (id) {

            // Destructure to exclude 'uploadedFiles'
            const { uploadedFiles, ...modelOnly } = formData;

            const formDataToSend = new FormData();
            if (uploadedFiles && uploadedFiles.length > 0) {
                uploadedFiles.forEach((fileWrapper) => {
                    formDataToSend.append("files", fileWrapper.fileObject); // ✅ send the actual File
                });
            }
            formDataToSend.append("model", JSON.stringify(modelOnly)); // Add only model data



            // Send the request using Axios
            const response = await api.put('Inquiry', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            toast.success('Saved successfully!');

            // const response = await api.put('Inquiry', formData);
            // console.log('Response:', response.data);
            navigate('/inquiries')

        }
        else {
            try {

                // Destructure to exclude 'uploadedFile'
                const { uploadedFiles, ...modelOnly } = formData;

                const formDataToSend = new FormData();
                if (uploadedFiles && uploadedFiles.length > 0) {
                    uploadedFiles.forEach((fileWrapper) => {
                        formDataToSend.append("files", fileWrapper.fileObject); // ✅ send the actual File
                    });
                }
                formDataToSend.append("model", JSON.stringify(modelOnly)); // Add only model data


                // Send the request using Axios
                const response = await api.post('Inquiry', formDataToSend, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                toast.success('Saved successfully!');

                // const response = await api.put('Inquiry', formData);
                // console.log('Response:', response.data);
                navigate('/inquiries')


                // const response = await api.post('Inquiry', formData);
                // console.log('Response:', response.data);
                // // Maybe show a success message or reset the form here
                // navigate('/inquiries')
            } catch (error) {
                console.error('Error submitting form:', error);
                // Maybe show an error message
            }
        }

    };

    const CustomSelect = ({ label, name, value, options, onChange }: any) => (
        <FormControl fullWidth>
            <InputLabel>{label}</InputLabel>
            <Select
                label={label}
                name={name}
                value={value}
                onChange={onChange}
            >
                {options.map((option: string) => (
                    <MenuItem key={option} value={option}>
                        {option}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );

    const handleEnumChange = async (type: ListOfValueType, value: string) => {
        // Check if the value exists and if not, add a new one via API
        const isExist = listOfValues.some(c => c.value.toLowerCase() === value.toLowerCase() && c.type === type);
        if (!isExist) {
            try {
                await api.post('ListOfValues', { id: 0, type, value });
                fetchListOfValues(); // Reload list after adding new value
            } catch (error) {
                console.error(`Error adding new ${type}:`, error);
            }
        }
    };
    const handleMultiEnumChangeValue = (
        type: ListOfValueType,
        setFunction: React.Dispatch<React.SetStateAction<any>>
    ) => {
        return async (event: any, newValue: any[]) => {
            const cleanedValues = await Promise.all(
                newValue.map(async (item) => {
                    if (typeof item === 'string') {
                        await handleEnumChange(type, item.trim());
                        return item.trim();
                    } else if (item.inputValue) {
                        const val = item.inputValue.trim();
                        await handleEnumChange(type, val);
                        return val;
                    } else {
                        return item.label;
                    }
                })
            );

            setFunction((prev: any) => ({
                ...prev,
                [type]: cleanedValues
            }));
        };
    };
    const handleEnumChangeValue = (type: ListOfValueType, setFunction: React.Dispatch<React.SetStateAction<any>>) => {
        return async (event: any, newValue: any) => {

            if (!newValue) {
                const value = newValue.trim();
                setFunction((prev: any) => ({
                    ...prev,
                    [type]: value
                }));
                return;
            }
            if (newValue) {
                if (typeof newValue === 'string') {
                    const value = newValue.trim();
                    setFunction((prev: any) => ({
                        ...prev,
                        [type]: value
                    }));
                    await handleEnumChange(type, value);
                }
                else if (newValue.inputValue) {
                    // Custom entry selected via "Add 'xxx'"
                    const value = newValue.inputValue.trim();
                    setFunction((prev: any) => ({
                        ...prev,
                        [type]: value
                    }));
                    await handleEnumChange(type, value);
                }
                else {
                    setFunction((prev: any) => ({
                        ...prev,
                        [type]: newValue.label
                    }));
                }
            } else {
                setFunction((prev: any) => ({
                    ...prev,
                    [type]: ""
                }));
            }
        };
    };


    // handle file upload
    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newFiles: uploadedFiles[] = Array.from(files).map(file => ({
                attachmentId: 0,
                fileObject: file,
                originalFileName: file.name,
            }));
            setFormData((prevData) => ({
                ...prevData,
                uploadedFiles: [...(prevData.uploadedFiles || []), ...newFiles],
            }));
        }
    };

    // const handleDeleteFile = (file: any) => {
    //     setFormData((prevData) => ({
    //         ...prevData,
    //         uploadedFiles: prevData.uploadedFiles.filter((_, index) => index !== indexToDelete),
    //     }));
    // };

    const handleDeleteFile = (file: any) => {
        api.delete(`Inquiry/deleteFile/${file.attachmentId}`)
            .then((res) => {
                console.log("File deleted:", res.data);

                // Remove the deleted file from the uploadedFiles state
                setFormData((prevData) => ({
                    ...prevData,
                    uploadedFiles: prevData.uploadedFiles.filter((uploadedFile) => uploadedFile.attachmentId !== file.attachmentId),
                }));
            })
            .catch((err) => {
                console.error("Error deleting file:", err);
            });
    };


    const handleDownloadFile = (file: any) => {
        // Assuming `file.id` is used to fetch the file from your server
        api.get(`Inquiry/getFileById/${file.attachmentId}`, { responseType: 'blob' }) // Set responseType to 'blob' for file download
            .then((res) => {
                // Create a URL for the file blob
                const fileURL = URL.createObjectURL(res.data);

                // Create an anchor element and trigger the download
                const link = document.createElement('a');
                link.href = fileURL;
                link.download = file.originalFileName || 'downloaded_file'; // Use the file name or a default
                link.click();

                // Optionally, revoke the blob URL after download to free up memory
                URL.revokeObjectURL(fileURL);
            })
            .catch((error) => {
                console.error("Error downloading file:", error);
            });
    };


    const handleSubmitCust = async () => {
        try {
            await api.post('Customer', {
                id: 0,
                customerName: dialogValue.customerName,
                email: dialogValue.email,
                phoneNo: dialogValue.phoneNo,
                address: dialogValue.address,
                city: '',
                region: ''

            });

            await fetchCustomers(); // Refresh list


            setFormData(prev => ({
                ...prev,
                customerName: dialogValue.customerName,
                customerId: 0, // Update if API returns new ID
                email: dialogValue.email,
                phoneNo: dialogValue.phoneNo,
                address: dialogValue.address,
            }));

            setOpen(false);
        } catch (error) {
            console.error('Failed to add customer:', error);
        }
    };
    return (
        <Box sx={{ p: 0 }}>
            <Card sx={{ mt: '6px' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Inquiry Form
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 3 }} >
                            <TextField
                                fullWidth
                                label="Enquiry No"
                                name="enquiryNo"
                                value={formData.enquiryNo}
                                onChange={handleChange}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }} >
                            <TextField
                                fullWidth
                                label="Enquiry Date"
                                name="enquiryDate"
                                type="date"
                                value={formData.enquiryDate}
                                onChange={handleChange}
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />
                        </Grid>
                    </Grid>
                    <Typography variant="h6" sx={{ mt: 4 }}>
                        Customer Details
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Customer Type</InputLabel>
                                <Select
                                    label="Customer Type"
                                    name="customerType"
                                    value={formData.customerType}
                                    onChange={handleChange}
                                >
                                    {customerTypeOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >

                            <Autocomplete
                                freeSolo
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                options={customers}
                                getOptionLabel={(option) =>
                                    typeof option === 'string' ? option : option.label
                                }
                                filterOptions={(options, params): { label: string; value: number, email: string, phoneNo: string, address: string }[] => {
                                    const filtered = createFilterOptions<{ label: string; value: number, email: string, phoneNo: string, address: string }>()(options, params);

                                    if (params.inputValue !== '') {
                                        filtered.push({
                                            label: `Add "${params.inputValue}"`,
                                            value: -1, // or 0, any placeholder to indicate new entry
                                            inputValue: params.inputValue // optionally used to track free text
                                        } as any); // Cast to any if you're adding custom fields temporarily
                                    }

                                    return filtered;
                                }}
                                value={
                                    formData.customerName
                                        ? { label: formData.customerName, value: formData.customerId, address: formData.address, email: formData.email, phoneNo: formData.phoneNo }
                                        : null
                                }
                                onChange={(event, newValue) => {
                                    if (typeof newValue === 'string') {
                                        // Free text input
                                        setTimeout(() => {
                                            setDialogValue({
                                                customerName: newValue,
                                                email: '',
                                                address: '',
                                                phoneNo: '',
                                            });
                                            setOpen(true);
                                        });
                                    } else if (newValue && newValue.inputValue) {
                                        // User clicked the "Add" option
                                        setDialogValue({
                                            customerName: newValue.inputValue,
                                            email: '',
                                            address: '',
                                            phoneNo: '',
                                        });
                                        setOpen(true);
                                    } else if (newValue) {
                                        // Existing customer selected
                                        let custt = customers.filter(x => x.value == newValue.value)[0];
                                        setFormData((prev) => ({
                                            ...prev,
                                            customerName: newValue.label,
                                            customerId: newValue.value,
                                            email: custt.email,
                                            address: custt.address,
                                            phoneNo: custt.phoneNo,
                                        }));
                                    } else {
                                        // Cleared input
                                        setFormData((prev) => ({
                                            ...prev,
                                            customerName: '',
                                            customerId: 0
                                        }));
                                    }
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Customer Name" variant="outlined" />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField
                                fullWidth
                                label="Phone No"
                                name="phoneNo"
                                value={formData.phoneNo}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }} >
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Region</InputLabel>
                                <Select
                                    label="Region"
                                    name="region"
                                    value={formData.region}
                                    onChange={handleChange}
                                >
                                    {regionOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid size={{ xs: 12, sm: 6 }} >
                            <Autocomplete
                                freeSolo
                                selectOnFocus
                                clearOnBlur
                                handleHomeEndKeys
                                options={citys}
                                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                value={formData.stdPaymentTerms}
                                onChange={async (event, newValue) => {
                                    if (newValue) {
                                        // If user selected an option or typed a new one
                                        if (typeof newValue === 'string') {
                                            // User typed a new value
                                            const sTdstr = newValue.trim();

                                            // Set selected customer as a new object with label and value as 0 (new customer)
                                            setFormData((prev) => ({
                                                ...prev,
                                                city: sTdstr
                                            }));

                                            // Check if customer exists and call API to add new customer
                                            const isExist = listOfValues.some(c => c.value.toLowerCase() === sTdstr.toLowerCase() && c.type == ListOfValueType.City);
                                            if (!isExist) {
                                                try {
                                                    await api.post('ListOfValues', { id: 0, type: ListOfValueType.City, value: sTdstr });
                                                    fetchListOfValues(); // Reload StdPaymentTerms list
                                                } catch (error) {
                                                    console.error('Error adding new StdPaymentTerms:', error);
                                                }
                                            }
                                        } else {
                                            // User selected an option from the dropdown
                                            setFormData((prev) => ({
                                                ...prev,
                                                city: newValue.label
                                            }));
                                        }
                                    } else {
                                        // If user cleared the input, reset customer values
                                        setFormData((prev) => ({
                                            ...prev,
                                            city: ''
                                        }));
                                    }
                                }}
                                filterOptions={(options, params): { label: string; value: number }[] => {
                                    const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                    if (params.inputValue !== '') {
                                        filtered.push({
                                            label: `Add "${params.inputValue}"`,
                                            value: -1, // or 0, any placeholder to indicate new entry
                                            inputValue: params.inputValue // optionally used to track free text
                                        } as any); // Cast to any if you're adding custom fields temporarily
                                    }

                                    return filtered;
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="City" variant="outlined" />
                                )}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card sx={{ mt: '6px' }}>
                <CardContent>
                    <Grid container spacing={2}>
                        {/* Brand Mapping Section */}
                        <Grid size={{ xs: 12 }} >
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                <Typography variant="h6">
                                    Technical Details  <Button
                                        onClick={handleOpenModal}
                                        variant="outlined"
                                        sx={{ ml: 'auto' }}
                                    >
                                        Add Details
                                    </Button>
                                </Typography>
                            </Box>

                            {formData.techicalDetailsMapping.length > 0 && (
                                <TableContainer sx={{
                                    maxHeight: 300,
                                    width: '100%',
                                    overflow: 'auto',
                                    display: 'block'
                                }}>
                                    <Table stickyHeader size="small">
                                        <TableHead>
                                            <TableRow sx={{ backgroundColor: '#e0e0e0' }}>
                                                <TableCell>Action</TableCell>
                                                <TableCell>Motor Type</TableCell>
                                                <TableCell>KW</TableCell>
                                                <TableCell>HP</TableCell>
                                                <TableCell>Phase</TableCell>
                                                <TableCell>Pole</TableCell>
                                                <TableCell>Frame Size</TableCell>
                                                <TableCell>DOP</TableCell>
                                                <TableCell>Insu. Class</TableCell>
                                                <TableCell>Efficiency</TableCell>
                                                <TableCell>Voltage</TableCell>
                                                <TableCell>Frequency</TableCell>
                                                <TableCell>Qty</TableCell>
                                                <TableCell>Mounting</TableCell>
                                                <TableCell>Safe/Hazardous</TableCell>
                                                <TableCell>Brand</TableCell>
                                                <TableCell>Zone</TableCell>
                                                <TableCell>Temp Class</TableCell>
                                                <TableCell>Gas Group</TableCell>
                                                <TableCell>Hazardous Desc</TableCell>
                                                <TableCell>Duty</TableCell>
                                                <TableCell>StartsPerHour</TableCell>
                                                <TableCell>Cdf</TableCell>
                                                <TableCell>AmbientTemp</TableCell>
                                                <TableCell>TempRise</TableCell>
                                                <TableCell>Accessories</TableCell>
                                                <TableCell>Brake</TableCell>
                                                <TableCell>EncoderMounting</TableCell>
                                                <TableCell>EncoderMountingIfYes</TableCell>
                                                <TableCell>Application</TableCell>
                                                <TableCell>Segment</TableCell>
                                                <TableCell>Amount</TableCell>
                                                <TableCell>Total Amt</TableCell>
                                                <TableCell>Narration</TableCell>

                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {formData.techicalDetailsMapping.map((brand, index) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Button
                                                            color="primary"
                                                            onClick={() => handleEditBrand(index)}
                                                            startIcon={<Edit />}
                                                        >
                                                        </Button>
                                                        <Button
                                                            color="secondary"
                                                            onClick={() => handleDeleteDialogOpen(index)}
                                                            startIcon={<Delete />}
                                                        >
                                                        </Button>
                                                    </TableCell>
                                                    <TableCell>{brand.motorType}</TableCell>
                                                    <TableCell>{brand.kw}</TableCell>
                                                    <TableCell>{brand.hp}</TableCell>
                                                    <TableCell>{brand.phase}</TableCell>
                                                    <TableCell>{brand.pole}</TableCell>
                                                    <TableCell>{brand.frameSize}</TableCell>
                                                    <TableCell>{brand.dop}</TableCell>
                                                    <TableCell>{brand.insulationClass}</TableCell>
                                                    <TableCell>{brand.efficiency}</TableCell>
                                                    <TableCell>{brand.voltage}</TableCell>
                                                    <TableCell>{brand.frequency}</TableCell>
                                                    <TableCell>{brand.quantity}</TableCell>
                                                    <TableCell>{brand.mounting}</TableCell>
                                                    <TableCell>{brand.safeAreaHazardousArea}</TableCell>
                                                    <TableCell>{brand.brand}</TableCell>
                                                    <TableCell>{brand.zone}</TableCell>
                                                    <TableCell>{brand.tempClass}</TableCell>
                                                    <TableCell>{brand.gasGroup}</TableCell>
                                                    <TableCell>{brand.hardadousDescription}</TableCell>
                                                    <TableCell>{brand.duty}</TableCell>
                                                    <TableCell>{brand.startsPerHour}</TableCell>
                                                    <TableCell>{brand.cdf}</TableCell>
                                                    <TableCell>{brand.ambientTemp}</TableCell>
                                                    <TableCell>{brand.tempRise}</TableCell>
                                                    <TableCell>{brand.accessories}</TableCell>
                                                    <TableCell>{brand.brake}</TableCell>
                                                    <TableCell>{brand.encoderMounting}</TableCell>
                                                    <TableCell>{brand.encoderMountingIfYes}</TableCell>
                                                    <TableCell>{brand.application}</TableCell>
                                                    <TableCell>{brand.segment}</TableCell>
                                                    <TableCell>{brand.amount}</TableCell>
                                                    <TableCell>{+brand.amount * +brand.quantity}</TableCell>
                                                    <TableCell>{brand.narration}</TableCell>

                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}

                        </Grid>

                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ mt: '6px' }}>
                <CardContent>

                    <Grid size={{ xs: 12, sm: 4 }} >
                        <Typography variant="h6" sx={{ mt: 4 }}>
                            Other Details
                        </Typography>
                    </Grid>
                    <Grid container spacing={2}>

                        {/* Standard Payment Terms */}
                        <Grid size={{ xs: 12, sm: 3 }} >
                            <Autocomplete
                                freeSolo
                                options={stdPaymentTerms}
                                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                value={formData.stdPaymentTerms}
                                onChange={async (event, newValue) => {
                                    if (newValue) {
                                        // If user selected an option or typed a new one
                                        if (typeof newValue === 'string') {
                                            // User typed a new value
                                            const sTdstr = newValue.trim();

                                            // Set selected customer as a new object with label and value as 0 (new customer)
                                            setFormData((prev) => ({
                                                ...prev,
                                                stdPaymentTerms: sTdstr
                                            }));

                                            // Check if customer exists and call API to add new customer
                                            const isExist = listOfValues.some(c => c.value.toLowerCase() === sTdstr.toLowerCase() && c.type == ListOfValueType.StdPaymentTerms);
                                            if (!isExist) {
                                                try {
                                                    await api.post('ListOfValues', { id: 0, type: ListOfValueType.StdPaymentTerms, value: sTdstr });
                                                    fetchListOfValues(); // Reload StdPaymentTerms list
                                                } catch (error) {
                                                    console.error('Error adding new StdPaymentTerms:', error);
                                                }
                                            }
                                        } else {
                                            // User selected an option from the dropdown
                                            setFormData((prev) => ({
                                                ...prev,
                                                stdPaymentTerms: newValue.label
                                            }));
                                        }
                                    } else {
                                        // If user cleared the input, reset customer values
                                        setFormData((prev) => ({
                                            ...prev,
                                            stdPaymentTerms: ''
                                        }));
                                    }
                                }}
                                filterOptions={(options, params): { label: string; value: number }[] => {
                                    const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                    if (params.inputValue !== '') {
                                        filtered.push({
                                            label: `Add "${params.inputValue}"`,
                                            value: -1, // or 0, any placeholder to indicate new entry
                                            inputValue: params.inputValue // optionally used to track free text
                                        } as any); // Cast to any if you're adding custom fields temporarily
                                    }

                                    return filtered;
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Std Payment Terms" variant="outlined" />
                                )}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }} >
                            <TextField
                                fullWidth
                                label="Std Inco Terms"
                                name="stdIncoTerms"
                                value={formData.stdIncoTerms}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    {/* Pricing Section */}
                    <Grid container spacing={2} sx={{ mt: 3 }}>
                        <Grid size={{ xs: 12, sm: 3 }} >
                            <TextField
                                fullWidth
                                label="List Price"
                                name="listPrice"
                                type="number"
                                value={formData.listPrice}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 3 }} >
                            <TextField
                                fullWidth
                                label="Discount"
                                name="discount"
                                type="number"
                                value={formData.discount}
                                onChange={handleChange}
                            />
                        </Grid>
                        {/* <Grid size={{ xs: 12, sm: 3 }} >
                            <TextField
                                fullWidth
                                label="Net Price (without GST)"
                                name="netPriceWithoutGST"
                                type="number"
                                value={formData.netPriceWithoutGST}
                                onChange={handleChange}
                            />
                        </Grid> */}
                        <Grid size={{ xs: 12, sm: 3 }} >
                            <TextField
                                fullWidth
                                label="Total Package"
                                name="totalPackage"
                                type="number"
                                value={formData.totalPackage}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, sm: 2 }}>
                            <Typography variant="h6" sx={{ mt: 1 }}>
                                Upload Files
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Button
                                variant="contained"
                                component="label"

                            >
                                Choose Files
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    onChange={handleFileUpload}
                                />
                            </Button>

                            {formData.uploadedFiles && formData.uploadedFiles.length > 0 && (
                                <Table size="small" sx={{ mt: 2 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>File Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {formData.uploadedFiles.map((file, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{file.originalFileName}</TableCell>
                                                <TableCell>
                                                    <Button
                                                        size="small"
                                                        onClick={() => handleDownloadFile(file)}>
                                                        Download
                                                    </Button>
                                                    <Button
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleDeleteFile(file)}>
                                                        Delete
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>



            <Card>
                <CardContent>
                    <Grid size={{ xs: 12, sm: 4 }} >
                        <Typography variant="h6" sx={{ mt: 1 }}>
                            RFQ
                        </Typography>
                    </Grid>
                    <Grid container spacing={2}>
                        {/* Inquiry Main Fields */}

                        <Grid size={{ xs: 12, sm: 4 }} >
                            <TextField
                                fullWidth
                                label="RFQ No"
                                name="rfqNo"
                                type="number"
                                value={formData.rfqNo}
                                slotProps={{
                                    input: {
                                        readOnly: true,
                                    },
                                }}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }} >
                            <TextField
                                fullWidth
                                label="RFQ Date"
                                type="date"
                                name="rfqDate"
                                value={formData.rfqDate}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }} >
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Status</InputLabel>
                                <Select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    {statusOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
            {/* Submit Button Centered */}
            <Grid size={{ xs: 12 }} >
                <Box mt={4} display="flex" justifyContent="center">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>
                        Submit Inquiry
                    </Button>
                </Box>
            </Grid>
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this brand mapping?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setOpenDeleteDialog(false)}
                        color="primary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteBrand} color="secondary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openModal} onClose={() => setOpenModal(false)}
                fullWidth
                maxWidth="lg" // options: 'xs', 'sm', 'md', 'lg', 'xl'
            >
                <DialogTitle sx={{
                    background: 'linear-gradient(to right,rgb(21, 129, 218), #21cbf3)',
                    color: 'white',
                }}>Technical Details</DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} sx={{ mt: 1, mb: 2 }}>
                        <Grid size={{ xs: 12, sm: 4 }} >
                            <FormControl fullWidth variant="outlined">
                                <InputLabel>Motor Type</InputLabel>
                                <Select
                                    label="Motor Type"
                                    name="motorType"
                                    value={brandInput.motorType}
                                    onChange={handleBrandChange}
                                >
                                    {motorTypeOptions.map((option) => (
                                        <MenuItem key={option} value={option}>
                                            {option}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label="KW"
                                    name="kw"
                                    value={brandInput.kw}
                                    onChange={handleBrandChange}
                                    inputMode="decimal" // Directly use inputMode here
                                />
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <FormControl fullWidth>
                                <TextField
                                    fullWidth
                                    label="HP"
                                    name="hp"
                                    value={brandInput.hp}
                                    onChange={handleBrandChange}
                                    inputMode="decimal" // Directly use inputMode here
                                />
                            </FormControl>
                        </Grid>

                        {/* Phase */}
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <CustomSelect
                                label="Phase"
                                name="phase"
                                value={brandInput.phase}
                                options={phaseOptions}
                                onChange={handleBrandChange}
                            />
                        </Grid>

                        {/* Pole */}
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <CustomSelect
                                label="Pole"
                                name="pole"
                                value={brandInput.pole}
                                options={poleOptions}
                                onChange={handleBrandChange}
                            />
                        </Grid>

                        {/* Frame Size */}
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <CustomSelect
                                label="Frame Size"
                                name="frameSize"
                                value={brandInput.frameSize}
                                options={frameSizeOptions}
                                onChange={handleBrandChange}
                            />
                        </Grid>

                        {/* DOP */}
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <CustomSelect
                                label="DOP"
                                name="dop"
                                value={brandInput.dop}
                                options={dopOptions}
                                onChange={handleBrandChange}
                            />
                        </Grid>

                        {/* Insulation Class */}
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <CustomSelect
                                label="Insulation Class"
                                name="insulationClass"
                                value={brandInput.insulationClass}
                                options={insulationClassOptions}
                                onChange={handleBrandChange}
                            />
                        </Grid>

                        {/* Efficiency */}
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <CustomSelect
                                label="Efficiency"
                                name="efficiency"
                                value={brandInput.efficiency}
                                options={efficiencyOptions}
                                onChange={handleBrandChange}
                            />
                        </Grid>
                        {/* Voltage */}
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <Autocomplete
                                freeSolo
                                options={voltages}
                                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                value={brandInput.voltage}
                                onChange={handleEnumChangeValue(ListOfValueType.Voltage, setBrandInput)}
                                filterOptions={(options, params): { label: string; value: number }[] => {
                                    const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                    if (params.inputValue !== '') {
                                        filtered.push({
                                            label: `Add "${params.inputValue}"`,
                                            value: -1, // or 0, any placeholder to indicate new entry
                                            inputValue: params.inputValue // optionally used to track free text
                                        } as any); // Cast to any if you're adding custom fields temporarily
                                    }

                                    return filtered;
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Voltage" variant="outlined" />
                                )}
                            />
                        </Grid>
                        {/* Frequency */}
                        <Grid size={{ xs: 12, sm: 2 }} >
                            <Autocomplete
                                freeSolo
                                options={frequencies}
                                getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                value={brandInput.frequency}
                                onChange={handleEnumChangeValue(ListOfValueType.Frequency, setBrandInput)}
                                filterOptions={(options, params): { label: string; value: number }[] => {
                                    const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                    if (params.inputValue !== '') {
                                        filtered.push({
                                            label: `Add "${params.inputValue}"`,
                                            value: -1, // or 0, any placeholder to indicate new entry
                                            inputValue: params.inputValue // optionally used to track free text
                                        } as any); // Cast to any if you're adding custom fields temporarily
                                    }

                                    return filtered;
                                }}
                                renderInput={(params) => (
                                    <TextField {...params} label="Frequency" variant="outlined" />
                                )}
                            />
                        </Grid>
                        <Grid container spacing={2}>

                            <Grid size={{ xs: 12, sm: 4 }} >
                                <TextField
                                    fullWidth
                                    label="Quantity"
                                    name="quantity"
                                    value={brandInput.quantity}
                                    onChange={handleBrandChange}
                                />
                            </Grid>

                            {/* Mounting */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <CustomSelect
                                    label="Mounting"
                                    name="mounting"
                                    value={brandInput.mounting}
                                    options={mountingOptions}
                                    onChange={handleBrandChange}
                                />
                            </Grid>

                            {/* Safe Area / Hazardous Area */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <CustomSelect
                                    label="Safe Area / Hazardous Area"
                                    name="safeAreaHazardousArea"
                                    value={brandInput.safeAreaHazardousArea}
                                    options={safeAreaOptions}
                                    onChange={handleBrandChange}
                                />
                            </Grid>

                            {/* Brand */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <Autocomplete
                                    freeSolo
                                    options={brands}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                    value={brandInput.brand}
                                    onChange={handleEnumChangeValue(ListOfValueType.Brand, setBrandInput)}
                                    filterOptions={(options, params): { label: string; value: number }[] => {
                                        const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                        if (params.inputValue !== '') {
                                            filtered.push({
                                                label: `Add "${params.inputValue}"`,
                                                value: -1, // or 0, any placeholder to indicate new entry
                                                inputValue: params.inputValue // optionally used to track free text
                                            } as any); // Cast to any if you're adding custom fields temporarily
                                        }

                                        return filtered;
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Brand" variant="outlined" />
                                    )}
                                />
                            </Grid>

                            {/* Zone - show only if Hazardous Area */}
                            {brandInput.safeAreaHazardousArea === 'Hazardous Area' && (
                                <>
                                    <Grid size={{ xs: 12, sm: 4 }} >
                                        <CustomSelect
                                            label="Zone"
                                            name="zone"
                                            value={brandInput.zone}
                                            options={zoneOptions}
                                            onChange={handleBrandChange}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }} >
                                        <CustomSelect
                                            label="Gas Group"
                                            name="gasGroup"
                                            value={brandInput.gasGroup}
                                            options={gasGroupOptions}
                                            onChange={handleBrandChange}
                                        />
                                    </Grid>
                                    {/* Temp Class */}
                                    <Grid size={{ xs: 12, sm: 4 }} >
                                        <CustomSelect
                                            label="Temp Class"
                                            name="tempClass"
                                            value={brandInput.tempClass}
                                            options={tempClassOptions}
                                            onChange={handleBrandChange}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 4 }} >
                                        <TextField
                                            fullWidth
                                            label="Hazardous Area Description"
                                            name="hardadousDescription"
                                            value={brandInput.hardadousDescription}
                                            onChange={handleBrandChange}
                                        />
                                    </Grid>
                                </>
                            )}

                            {/* Duty */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <CustomSelect
                                    label="Duty"
                                    name="duty"
                                    value={brandInput.duty}
                                    options={dutyOptions}
                                    onChange={handleBrandChange}
                                />
                            </Grid>
                            {/* Starts per Hour */}
                            {(brandInput.duty !== 'S1' && brandInput.duty !== 'S3' && brandInput.duty !== 'S2-15min' && brandInput.duty !== 'S2-30min') && (<Grid size={{ xs: 12, sm: 4 }} >
                                <Autocomplete
                                    freeSolo
                                    options={startsPerHour}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                    value={brandInput.startsPerHour}
                                    onChange={handleEnumChangeValue(ListOfValueType.StartsPerHour, setBrandInput)}
                                    filterOptions={(options, params): { label: string; value: number }[] => {
                                        const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                        if (params.inputValue !== '') {
                                            filtered.push({
                                                label: `Add "${params.inputValue}"`,
                                                value: -1, // or 0, any placeholder to indicate new entry
                                                inputValue: params.inputValue // optionally used to track free text
                                            } as any); // Cast to any if you're adding custom fields temporarily
                                        }

                                        return filtered;
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Starts per Hour" variant="outlined" />
                                    )}
                                />
                            </Grid>)}
                            {/* CDF */}
                            {(brandInput.duty !== 'S1' && brandInput.duty !== 'S3' && brandInput.duty !== 'S2-15min' && brandInput.duty !== 'S2-30min') && (<Grid size={{ xs: 12, sm: 4 }} >
                                <CustomSelect
                                    label="CDF"
                                    name="cdf"
                                    value={brandInput.cdf}
                                    options={cdfOptions}
                                    onChange={handleBrandChange}
                                />
                            </Grid>

                            )}
                            {/* Ambient Temperature */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <Autocomplete
                                    freeSolo
                                    options={ambientTemps}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                    value={brandInput.ambientTemp}
                                    onChange={handleEnumChangeValue(ListOfValueType.AmbientTemp, setBrandInput)}
                                    filterOptions={(options, params): { label: string; value: number }[] => {
                                        const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                        if (params.inputValue !== '') {
                                            filtered.push({
                                                label: `Add "${params.inputValue}"`,
                                                value: -1, // or 0, any placeholder to indicate new entry
                                                inputValue: params.inputValue // optionally used to track free text
                                            } as any); // Cast to any if you're adding custom fields temporarily
                                        }

                                        return filtered;
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Ambient Temp" variant="outlined" />
                                    )}
                                />
                            </Grid>

                            {/* Temp Rise */}
                            {brandInput.insulationClass === 'F' && (<Grid size={{ xs: 12, sm: 4 }} >
                                <CustomSelect
                                    label="Temp Rise"
                                    name="tempRise"
                                    value={brandInput.tempRise}
                                    options={tempRiseOptions}
                                    onChange={handleBrandChange}
                                />
                            </Grid>)}

                            {brandInput.insulationClass === 'H' && (<Grid size={{ xs: 12, sm: 4 }} >
                                <CustomSelect
                                    label="Temp Rise"
                                    name="tempRise"
                                    value={brandInput.tempRise}
                                    options={tempRiseOptionsH}
                                    onChange={handleBrandChange}
                                />
                            </Grid>)}

                            {/* Accessories */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <Autocomplete
                                    freeSolo
                                    multiple
                                    options={accessories}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                    value={brandInput.accessories || []}
                                    onChange={handleMultiEnumChangeValue(ListOfValueType.Accessories, setBrandInput)}
                                    filterOptions={(options, params): { label: string; value: number }[] => {
                                        const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                        if (params.inputValue !== '') {
                                            filtered.push({
                                                label: `Add "${params.inputValue}"`,
                                                value: -1, // or 0, any placeholder to indicate new entry
                                                inputValue: params.inputValue // optionally used to track free text
                                            } as any); // Cast to any if you're adding custom fields temporarily
                                        }

                                        return filtered;
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Accessories" variant="outlined" />
                                    )}


                                />
                            </Grid>

                            {/* Brake */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <CustomSelect
                                    label="Brake"
                                    name="brake"
                                    value={brandInput.brake}
                                    options={yesNoOptions}
                                    onChange={handleBrandChange}
                                />
                            </Grid>

                            {/* Encoder Mounting */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <CustomSelect
                                    label="Encoder Mounting"
                                    name="encoderMounting"
                                    value={brandInput.encoderMounting}
                                    options={yesNoOptions}
                                    onChange={handleBrandChange}
                                />
                            </Grid>
                            {/* Encoder Scope - show if Encoder Mounting is Yes */}
                            {brandInput.encoderMounting === 'Yes' && (
                                <Grid size={{ xs: 12, sm: 4 }} >
                                    <CustomSelect
                                        label="Encoder Scope"
                                        name="encoderMountingIfYes"
                                        value={brandInput.encoderMountingIfYes}
                                        options={encoderScopeOptions}
                                        onChange={handleBrandChange}
                                    />
                                </Grid>
                            )}

                            {/* Application */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <Autocomplete
                                    freeSolo
                                    options={applications}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                    value={brandInput.application}
                                    onChange={handleEnumChangeValue(ListOfValueType.Application, setBrandInput)}
                                    filterOptions={(options, params): { label: string; value: number }[] => {
                                        const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                        if (params.inputValue !== '') {
                                            filtered.push({
                                                label: `Add "${params.inputValue}"`,
                                                value: -1, // or 0, any placeholder to indicate new entry
                                                inputValue: params.inputValue // optionally used to track free text
                                            } as any); // Cast to any if you're adding custom fields temporarily
                                        }

                                        return filtered;
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Application" variant="outlined" />
                                    )}
                                />
                            </Grid>

                            {/* Segment */}
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <Autocomplete
                                    freeSolo
                                    options={segments}
                                    getOptionLabel={(option) => typeof option === 'string' ? option : option.label}
                                    value={brandInput.segment}
                                    onChange={handleEnumChangeValue(ListOfValueType.Segment, setBrandInput)}
                                    filterOptions={(options, params): { label: string; value: number }[] => {
                                        const filtered = createFilterOptions<{ label: string; value: number }>()(options, params);

                                        if (params.inputValue !== '') {
                                            filtered.push({
                                                label: `Add "${params.inputValue}"`,
                                                value: -1, // or 0, any placeholder to indicate new entry
                                                inputValue: params.inputValue // optionally used to track free text
                                            } as any); // Cast to any if you're adding custom fields temporarily
                                        }

                                        return filtered;
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="Segment" variant="outlined" />
                                    )}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }} >
                                <TextField
                                    fullWidth
                                    label="Amount"
                                    name="amount"
                                    value={brandInput.amount}
                                    onChange={handleBrandChange}
                                />
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }} >
                            <TextField
                                fullWidth
                                label="Narration"
                                name="narration"
                                value={brandInput.narration}
                                onChange={handleBrandChange}
                                multiline
                                rows={2}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'flex-end' }}>
                    <Button variant="outlined" onClick={() => setOpenModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={addBrand}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Customer Name"
                                fullWidth
                                value={dialogValue.customerName}
                                onChange={(e) =>
                                    setDialogValue({ ...dialogValue, customerName: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Email"
                                fullWidth
                                value={dialogValue.email}
                                onChange={(e) =>
                                    setDialogValue({ ...dialogValue, email: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Phone No"
                                fullWidth
                                value={dialogValue.phoneNo}
                                onChange={(e) =>
                                    setDialogValue({ ...dialogValue, phoneNo: e.target.value })
                                }
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                label="Address"
                                fullWidth
                                multiline
                                value={dialogValue.address}
                                onChange={(e) =>
                                    setDialogValue({ ...dialogValue, address: e.target.value })
                                }
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmitCust} variant="contained">Add</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default InquiryForm;
