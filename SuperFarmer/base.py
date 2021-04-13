class Serializable:
    def serialize(self):
        return self.__class__.serialize(self)

    @classmethod
    def serialize(cls, instance):
        return instance

    @classmethod
    def serialize_many(cls, instances):
        result = []

        for instance in instances:
            result.append(cls.serialize(instance))

        return result
