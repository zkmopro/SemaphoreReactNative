import ExpoModulesCore

public class IdentityModule: Module {
  private var identity: Identity? = nil

  public func definition() -> ModuleDefinition {
    Name("Identity")

    Function("initIdentity") { (privateKey: Data) in
      self.identity = Identity(privateKey: privateKey)
    }

    Function("commitment") {
      return self.identity?.commitment()
    }

    Function("privateKey") {
      return self.identity?.privateKey()
    }

    Function("secretScalar") {
      return self.identity?.secretScalar()
    }

    Function("toElement") {
      return self.identity?.toElement()
    }
  }
}
