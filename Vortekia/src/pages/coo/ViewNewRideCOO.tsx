import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import toast, { Toaster } from "react-hot-toast";
import COONavigationBar from "../../components/COONavigationBar";

type NewRideProposal = {
  proposal_id: number;
  ride_name: string;
  ride_description: string;
  ride_price: number;
  ride_open_time: string;
  ride_close_time: string;
  file_link: string;
};

function ViewNewRideCOO() {
  const [proposals, setProposals] = useState<NewRideProposal[]>([]);

  async function fetchProposals() {
    try {
      const data: NewRideProposal[] = await invoke("view_all_ride_proposals");
      setProposals(data);
    } catch (error) {
      toast.error(error as string); 
    }
  }

  function handleDownload(filePath: string) {
    const link = document.createElement("a");
    link.href = `../../${filePath}`;
    link.download = filePath.split("/").pop() || "proposal.pdf";
    link.click();
  }

  async function handleAccept(proposal: NewRideProposal) {
    try {
      await invoke("insert_ride", {
        name: proposal.ride_name,
        description: proposal.ride_description,
        price: proposal.ride_price.toString(),
        openTime: proposal.ride_open_time,
        closeTime: proposal.ride_close_time,
      });

      await invoke("delete_new_ride_proposal_by_id", {
        id: proposal.proposal_id.toString(),
      });

      toast.success("Ride added and proposal deleted!");
      fetchProposals();
    } catch (err) {
      toast.error(err as string);
    }
  }

  async function handleReject(proposal: NewRideProposal) {
    try {
      await invoke("delete_new_ride_proposal_by_id", {
        id: proposal.proposal_id.toString(),
      });
      toast.success("Proposal rejected and deleted.");
      fetchProposals();
    } catch (err) {
      toast.error(err as string);
    }
  }

  useEffect(() => {
    fetchProposals();
  }, []);

  return (
    <div>
      <Toaster />
      <COONavigationBar />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-3xl font-bold mb-6">New Ride Proposals</h1>
        <div className="grid grid-cols-3 gap-6">
          {proposals.map((proposal) => (
            <div
              key={proposal.proposal_id}
              className="bg-white shadow-md rounded-lg p-4"
            >
              <h2 className="font-bold text-xl mb-1">{proposal.ride_name}</h2>
              <p className="text-sm text-gray-700 mb-1">
                {proposal.ride_description}
              </p>
              <p className="text-sm">Price: ${proposal.ride_price}</p>
              <p className="text-sm">
                Time: {proposal.ride_open_time} - {proposal.ride_close_time}
              </p>

              <button
                onClick={() => handleDownload(proposal.file_link)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download Proposal
              </button>

              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleAccept(proposal)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(proposal)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewNewRideCOO;
