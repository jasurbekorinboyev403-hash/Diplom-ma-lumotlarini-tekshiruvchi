import { useEffect, useState } from "react";
import { BrowserProvider, Contract, keccak256, toUtf8Bytes } from "ethers";
import { contractAbi, contractAddress } from "./contract";

const initialForm = {
  studentWalletId: "",
  studentAddress: "",
  studentName: "",
  institutionName: "",
  programName: "",
  credentialType: "Diploma",
  grade: "",
  metadataUri: "",
  notes: ""
};

function buildDetailsHash(values) {
  return keccak256(
    toUtf8Bytes(
      [
        values.studentWalletId,
        values.studentName,
        values.studentAddress,
        values.institutionName,
        values.programName,
        values.credentialType,
        values.grade,
        values.metadataUri,
        values.notes
      ].join("|")
    )
  );
}

function formatTimestamp(timestamp) {
  if (!timestamp) {
    return "-";
  }

  return new Date(Number(timestamp) * 1000).toLocaleString();
}

export default function App() {
  const [account, setAccount] = useState("");
  const [networkName, setNetworkName] = useState("");
  const [status, setStatus] = useState("Hamyonni ulang va kontrakt manzilini `.env` orqali kiriting.");
  const [form, setForm] = useState(initialForm);
  const [verifyId, setVerifyId] = useState("");
  const [verifyHash, setVerifyHash] = useState("");
  const [studentLookupId, setStudentLookupId] = useState("");
  const [viewerAddress, setViewerAddress] = useState("");
  const [sharedRecordId, setSharedRecordId] = useState("");
  const [recordIds, setRecordIds] = useState([]);
  const [records, setRecords] = useState([]);
  const [verificationResult, setVerificationResult] = useState(null);

  async function getBrowserProvider() {
    if (!window.ethereum) {
      throw new Error("MetaMask topilmadi. Brauzerga MetaMask o‘rnating.");
    }

    return new BrowserProvider(window.ethereum);
  }

  async function getContract(withSigner = false) {
    const provider = await getBrowserProvider();
    const signer = withSigner ? await provider.getSigner() : null;
    return new Contract(contractAddress, contractAbi, signer || provider);
  }

  async function connectWallet() {
    try {
      const provider = await getBrowserProvider();
      const accounts = await provider.send("eth_requestAccounts", []);
      const network = await provider.getNetwork();
      setAccount(accounts[0]);
      setNetworkName(`${network.name} (${network.chainId})`);
      setStatus("Hamyon ulandi, endi diplom yoki sertifikat yaratish mumkin.");
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function issueRecord(event) {
    event.preventDefault();

    try {
      const contract = await getContract(true);
      const detailsHash = buildDetailsHash(form);

      setStatus("Blockchain tranzaksiya yuborilmoqda...");
      const tx = await contract.issueRecord(
        form.studentWalletId,
        form.studentAddress,
        form.studentName,
        form.institutionName,
        form.programName,
        form.credentialType,
        form.grade,
        form.metadataUri,
        detailsHash
      );
      await tx.wait();

      setVerifyHash(detailsHash);
      setStatus("Diplom yoki sertifikat blockchain’da muvaffaqiyatli yaratildi.");
      setForm(initialForm);
    } catch (error) {
      setStatus(error.reason || error.message);
    }
  }

  async function verifyRecord() {
    try {
      const contract = await getContract();
      const [isValid, isRevoked] = await contract.verifyRecord(verifyId, verifyHash);
      const record = await contract.getRecord(verifyId);
      setVerificationResult({ isValid, isRevoked, record });
      setStatus("Tekshiruv yakunlandi.");
    } catch (error) {
      setStatus(error.reason || error.message);
      setVerificationResult(null);
    }
  }

  async function searchStudentRecords() {
    try {
      const contract = await getContract();
      const ids = await contract.getRecordsByStudentWalletId(studentLookupId);
      setRecordIds(ids.map((value) => value.toString()));

      const loadedRecords = await Promise.all(ids.map(async (id) => contract.getRecord(id)));
      setRecords(loadedRecords);
      setStatus("Talaba yozuvlari yuklandi.");
    } catch (error) {
      setStatus(error.reason || error.message);
      setRecordIds([]);
      setRecords([]);
    }
  }

  async function shareRecord() {
    try {
      const contract = await getContract(true);
      const tx = await contract.shareRecord(sharedRecordId, viewerAddress);
      await tx.wait();
      setStatus("Yozuv boshqa universitet yoki ish beruvchiga ochildi.");
    } catch (error) {
      setStatus(error.reason || error.message);
    }
  }

  useEffect(() => {
    if (!window.ethereum) {
      return undefined;
    }

    function handleAccountsChanged(accounts) {
      setAccount(accounts[0] || "");
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    return () => window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">EduChain Registry</p>
          <h1>Diplom va sertifikatlarni blockchain’da tekshiruvchi ta’lim tizimi</h1>
          <p className="lead">
            Talabalar diplomlari, sertifikatlari va onlayn kurs natijalari yagona Web3 reyestrda saqlanadi,
            tekshiriladi va xavfsiz ulashiladi.
          </p>
        </div>
        <div className="hero-card">
          <button onClick={connectWallet} className="primary-button">MetaMask ulash</button>
          <p><strong>Hamyon:</strong> {account || "ulanmagan"}</p>
          <p><strong>Tarmoq:</strong> {networkName || "aniqlanmagan"}</p>
          <p><strong>Kontrakt:</strong> {contractAddress}</p>
        </div>
      </header>

      <main className="grid">
        <section className="panel">
          <h2>Diplom yoki Sertifikat Yaratish</h2>
          <form onSubmit={issueRecord} className="form-grid">
            <input placeholder="Talaba Wallet ID yoki Student ID" value={form.studentWalletId} onChange={(e) => setForm({ ...form, studentWalletId: e.target.value })} required />
            <input placeholder="Talaba wallet manzili (0x...)" value={form.studentAddress} onChange={(e) => setForm({ ...form, studentAddress: e.target.value })} required />
            <input placeholder="Talaba F.I.Sh." value={form.studentName} onChange={(e) => setForm({ ...form, studentName: e.target.value })} required />
            <input placeholder="Universitet yoki platforma nomi" value={form.institutionName} onChange={(e) => setForm({ ...form, institutionName: e.target.value })} required />
            <input placeholder="Mutaxassislik yoki kurs nomi" value={form.programName} onChange={(e) => setForm({ ...form, programName: e.target.value })} required />
            <select value={form.credentialType} onChange={(e) => setForm({ ...form, credentialType: e.target.value })}>
              <option>Diploma</option>
              <option>Certificate</option>
              <option>Course Result</option>
            </select>
            <input placeholder="Baho yoki GPA" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} required />
            <input placeholder="IPFS metadata URI yoki hujjat linki" value={form.metadataUri} onChange={(e) => setForm({ ...form, metadataUri: e.target.value })} />
            <textarea placeholder="Qo‘shimcha eslatma yoki kurs yakuni" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows="4" />
            <button type="submit" className="primary-button full-width">Blockchain’da yaratish</button>
          </form>
        </section>

        <section className="panel">
          <h2>Haqiqiylikni Tekshirish</h2>
          <div className="stack">
            <input placeholder="Record ID" value={verifyId} onChange={(e) => setVerifyId(e.target.value)} />
            <input placeholder="Details Hash" value={verifyHash} onChange={(e) => setVerifyHash(e.target.value)} />
            <button onClick={verifyRecord} className="secondary-button">Tekshirish</button>
          </div>
          {verificationResult && (
            <div className="result-card">
              <p><strong>Holat:</strong> {verificationResult.isValid ? "Haqiqiy" : "Mos kelmadi"}</p>
              <p><strong>Bekor qilinganmi:</strong> {verificationResult.isRevoked ? "Ha" : "Yo‘q"}</p>
              <p><strong>Talaba:</strong> {verificationResult.record.studentName}</p>
              <p><strong>Muassasa:</strong> {verificationResult.record.institutionName}</p>
              <p><strong>Yo‘nalish:</strong> {verificationResult.record.programName}</p>
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Talaba Yozuvlarini Ko‘rish</h2>
          <div className="stack">
            <input placeholder="Talaba Wallet ID yoki Student ID" value={studentLookupId} onChange={(e) => setStudentLookupId(e.target.value)} />
            <button onClick={searchStudentRecords} className="secondary-button">Qidirish</button>
          </div>
          <p className="muted">Topilgan IDlar: {recordIds.join(", ") || "yo‘q"}</p>
          <div className="records-list">
            {records.map((record) => (
              <article className="record-item" key={record.id.toString()}>
                <h3>{record.credentialType}: {record.programName}</h3>
                <p>{record.studentName} • {record.institutionName}</p>
                <p>Wallet: {record.studentAddress}</p>
                <p>Baho: {record.grade}</p>
                <p>Berilgan vaqt: {formatTimestamp(record.issuedAt)}</p>
                <p>URI: {record.metadataUri || "-"}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Ma’lumotni Ulish</h2>
          <div className="stack">
            <input placeholder="Record ID" value={sharedRecordId} onChange={(e) => setSharedRecordId(e.target.value)} />
            <input placeholder="Universitet yoki ish beruvchi wallet manzili" value={viewerAddress} onChange={(e) => setViewerAddress(e.target.value)} />
            <button onClick={shareRecord} className="secondary-button">Ulash</button>
          </div>
        </section>

        <section className="panel panel-wide">
          <h2>Tizim Imkoniyatlari</h2>
          <div className="feature-grid">
            <div>
              <h3>Yagona diplom reyestri</h3>
              <p>Barcha diplom, sertifikat va kurs natijalari bitta blockchain registrga yoziladi.</p>
            </div>
            <div>
              <h3>Markazsiz saqlash</h3>
              <p>Asosiy yozuvlar blockchain’da, metadata esa IPFS URI orqali ulanishga tayyor.</p>
            </div>
            <div>
              <h3>Tez verifikatsiya</h3>
              <p>Ish beruvchi yoki universitet hash va ID orqali yozuv haqiqiyligini tekshiradi.</p>
            </div>
            <div>
              <h3>Talaba nazorati</h3>
              <p>Talaba o‘z yozuvini boshqa tashkilotlarga ochishi va portativ identifikatsiyadan foydalanishi mumkin.</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer-status">
        <strong>Status:</strong> {status}
      </footer>
    </div>
  );
}
