import ExpoModulesCore
import moproFFI

public class GroupModule: Module {
  private var group: Group? = nil

  public func definition() -> ModuleDefinition {
    Name("Group")

    Function("initGroup") { (members: [[UInt8]]) in
      do {
        var membersData: [Data] = []
        for member in members {
          membersData.append(Data(member))
        }
        self.group = Group(members: membersData)
      } catch {
        throw Exception(name: "GroupInitError", description: "Failed to initialize group: \(error)")
      }
    }

    Function("root") {
      guard let group = self.group else {
        throw Exception(name: "GroupNotInitialized", description: "Group not initialized")
      }
      return group.root()
    }

    Function("depth") {
      guard let group = self.group else {
        throw Exception(name: "GroupNotInitialized", description: "Group not initialized")
      }
      return group.depth()
    }

    Function("members") {
      guard let group = self.group else {
        throw Exception(name: "GroupNotInitialized", description: "Group not initialized")
      }
      return group.members()
    }

    Function("indexOf") { (member: [UInt8]) in
      guard let group = self.group else {
        throw Exception(name: "GroupNotInitialized", description: "Group not initialized")
      }
      return group.indexOf(member: Data(member))
    }

    Function("addMember") { (member: [UInt8]) throws -> Void in
      guard let group = self.group else {
        throw Exception(name: "GroupNotInitialized", description: "Group not initialized")
      }
      try group.addMember(member: Data(member))
    }

    Function("addMembers") { (members: [[UInt8]]) throws -> Void in
      guard let group = self.group else {
        throw Exception(name: "GroupNotInitialized", description: "Group not initialized")
      }
      var membersData: [Data] = []
      for member in members {
        membersData.append(Data(member))
      }
      try group.addMembers(members: membersData)
    }

    Function("updateMember") { (index: UInt32, member: [UInt8]) throws -> Void in
      guard let group = self.group else {
        throw Exception(name: "GroupNotInitialized", description: "Group not initialized")
      }
      try group.updateMember(index: index, member: Data(member))
    }

    Function("removeMember") { (index: UInt32) throws -> Void in
      guard let group = self.group else {
        throw Exception(name: "GroupNotInitialized", description: "Group not initialized")
      }
      try group.removeMember(index: index)
    }
  }
}
