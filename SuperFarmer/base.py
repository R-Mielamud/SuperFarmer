class Serializable:
    @classmethod
    def serialize(cls, instance, *args, **kwargs):
        return instance

    @classmethod
    def serialize_many(cls, instances, *args, **kwargs):
        result = []

        for instance in instances:
            result.append(cls.serialize(instance, *args, **kwargs))

        return result

    @classmethod
    def serialize_detailed(cls, instance, *args, **kwargs):
        return cls.serialize(instance, *args, **kwargs)

    def self_serialize(self, *args, **kwargs):
        return self.__class__.serialize(self, *args, **kwargs)

    def self_serialize_detailed(self, *args, **kwargs):
        return self.__class__.serialize_detailed(self, *args, **kwargs)
