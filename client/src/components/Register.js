import { useEffect, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { Buffer } from 'buffer';

const registerupload = async (record,mediChain,designation,account) =>{
    try
    {
      var name = record.name;
      var age = record.age;
      var email = record.email ; 
      var data = new FormData();
      data.append("file", new Blob([JSON.stringify(record)], { type: "application/json" }), "Registration_data.json"); // Provide a filename
      const res = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJmODgzYmRjMS00OTdkLTRhNTMtODkyYS1kZGY0MjZjNzhiMDAiLCJlbWFpbCI6InByYW1vZGRoYXlndWRlOTBAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInBpbl9wb2xpY3kiOnsicmVnaW9ucyI6W3siaWQiOiJGUkExIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9LHsiaWQiOiJOWUMxIiwiZGVzaXJlZFJlcGxpY2F0aW9uQ291bnQiOjF9XSwidmVyc2lvbiI6MX0sIm1mYV9lbmFibGVkIjpmYWxzZSwic3RhdHVzIjoiQUNUSVZFIn0sImF1dGhlbnRpY2F0aW9uVHlwZSI6InNjb3BlZEtleSIsInNjb3BlZEtleUtleSI6ImZiYzZhZjZhNGRkYzM2OWNhNGI5Iiwic2NvcGVkS2V5U2VjcmV0IjoiMmE5MTI0MjhmMWQwMWVkZjI4MzhhMTAyYzdlNjM3OGJkNmU1MzE5NjkzZmIwZjU3ZmQ3ODg5ZGI5ZDAxZTg0ZSIsImlhdCI6MTcxNTYyNDk5Mn0.NKz3J_hiL7h7UUet0RLq0aL62bjIPSrlCP9JvCc_N-0`,
          },
          body: data,
        }
      );
      
      const result = await res.json();
      console.log(result);
      console.log("register data uploaded succefuly");
      console.log(result.IpfsHash);
       console.log(mediChain);
       console.log(name,age,parseInt(designation),email,result.IpfsHash);
      mediChain.methods.register(name, age, parseInt(designation), email, result.IpfsHash).send({from: account}).on('transactionHash', async (hash) => {
                        window.location.href = '/login'
        })

    }
    catch(error)
    {
      console.log(error);
      console.log("faild to upload register data "); 
    }
  };


const Register = ({mediChain, connectWallet, token, account, setToken, setAccount}) => {
    const [designation, setDesignation] = useState("1");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if(account!=="" && designation==="1"){
            
          //  var record1 = record; 
            var record = {
                name: name,
                email: email,
                address: account,
                age: age,
                treatments: []
            };
            // ipfs.add(record).then((result, error) => {
            //     if(error){
            //         console.log(error);
            //         return;
            //     }else{
            //         mediChain.methods.register(name, age, parseInt(designation), email, result.path).send({from: account}).on('transactionHash', async (hash) => {
            //             window.location.href = '/login'
            //         })
            //     }
            // })
            registerupload(record,mediChain,designation,account);

        }else if(account!==""){
            mediChain.methods.register(name, 0, parseInt(designation), email, "").send({from: account}).on('transactionHash', async (hash) => {
                window.location.href = '/login'
            })
        }
    }

    useEffect(() => {
        var t = localStorage.getItem('token')
        var a = localStorage.getItem('account')
        t = t ? t : ""
        a = a ? a : ""
        if(t!=="" && a!=="") window.location.href = '/login';
        else{
            localStorage.removeItem('token')
            localStorage.removeItem('account')
            setToken('');
            setAccount('');
        }
    }, [token])

    return (
        <div className='register'>
            <div className='box'>
                <h2>Register</h2>
                <br />
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formWallet">
                        <Form.Label>Connect Wallet</Form.Label>
                        { account === "" ?
                        <Form.Control type="button" value="Connect to Metamask" onClick={connectWallet}/>
                        : <Form.Control type="button" disabled value={`Connected Wallet with Address: ${account}`}/>
                        }
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formDesignation">
                        <Form.Label>Designation</Form.Label>
                        <Form.Select onChange={(e) => setDesignation(e.target.value)} value={designation}>
                            <option value="1">Patient</option>
                            <option value="2">Doctor</option>
                            <option value="3">Insurance Provider</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
                    </Form.Group>
                    { designation==="1" ?
                    <Form.Group className="mb-3" controlId="formAge">
                        <Form.Label>Age</Form.Label>
                        <Form.Control type="number" value={age} min={18} onChange={(e) => setAge(e.target.value)} placeholder="Enter your age" />
                    </Form.Group>
                    : <></>
                    }
                    <Button variant="coolColor" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    )
}


export default Register