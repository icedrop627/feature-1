type SubscribeCallback = (payload: any) => void;

export class MockRealtimeChannel {
  private callbacks: Map<string, SubscribeCallback> = new Map();
  public channelName: string;

  constructor(channelName: string) {
    this.channelName = channelName;
  }

  on(
    event: string,
    options: { event: string; schema: string; table: string; filter: string },
    callback: SubscribeCallback
  ) {
    this.callbacks.set(`${event}-${options.filter}`, callback);
    return this;
  }

  subscribe() {
    return this;
  }

  // Test helper to trigger realtime updates
  triggerUpdate(payload: any) {
    this.callbacks.forEach((callback) => {
      callback(payload);
    });
  }
}

export const createMockSupabaseClient = () => {
  const channels = new Map<string, MockRealtimeChannel>();
  let updateMockResponse: any = { data: null, error: null };

  const mockClient = {
    from: jest.fn((table: string) => ({
      update: jest.fn((data: any) => ({
        eq: jest.fn((column: string, value: any) => {
          return Promise.resolve(updateMockResponse);
        }),
      })),
    })),
    channel: jest.fn((channelName: string) => {
      const channel = new MockRealtimeChannel(channelName);
      channels.set(channelName, channel);
      return channel;
    }),
    removeChannel: jest.fn((channel: MockRealtimeChannel) => {
      channels.delete(channel.channelName);
      return Promise.resolve({ status: 'ok' });
    }),
    // Test helpers
    __setUpdateResponse: (response: any) => {
      updateMockResponse = response;
    },
    __getChannel: (channelName: string) => channels.get(channelName),
    __getAllChannels: () => channels,
  };

  return mockClient;
};

export type MockSupabaseClient = ReturnType<typeof createMockSupabaseClient>;
