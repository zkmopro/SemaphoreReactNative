import ExpoModulesCore

public class ProofModule: Module {

  public func definition() -> ModuleDefinition {
    Name("Proof")

    AsyncFunction("generateSemaphoreProof") {
      (privateKey: Data, members: [[UInt8]], message: String, scope: String, treeDepth: Int) -> String
      in
      do {
        // Decode your Identity and Group if necessary from `Data`
        let identity = try Identity(privateKey: privateKey)
        var membersData: [Data] = []
        for member in members {
          membersData.append(Data(member))
        }
        let group = Group(members: membersData)

        // Convert Int to UInt16
        let depth = UInt16(treeDepth)

        // Call the actual Swift function
        let proof = try generateSemaphoreProof(
          identity: identity, group: group, message: message, scope: scope, merkleTreeDepth: depth)

        // Return the proof string directly
        return proof
      } catch {
        throw Exception(
          name: "SemaphoreProofError", description: "Failed to generate proof: \(error)")
      }
    }

    AsyncFunction("verifySemaphoreProof") { (proof: String) -> Bool in
      do {
        let isValid = try verifySemaphoreProof(proof: proof)
        return isValid
      } catch {
        throw Exception(
          name: "SemaphoreProofError", description: "Failed to verify proof: \(error)")
      }
    }
  }
}
